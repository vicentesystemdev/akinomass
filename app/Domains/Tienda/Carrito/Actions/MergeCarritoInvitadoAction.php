<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Carrito\Services\CarritoCalculoService;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Models\Carrito;
use App\Models\Producto;
use Illuminate\Support\Facades\DB;

class MergeCarritoInvitadoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
        private CarritoCalculoService $calculoService,
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(string $guestSessionId, int $userId, ?int $codCliente): ?Carrito
    {
        $guestCarrito = $this->persistenciaService->obtenerPorSessionId($guestSessionId);

        if (! $guestCarrito || $guestCarrito->detalles->isEmpty()) {
            return $this->persistenciaService->obtenerPorUserId($userId);
        }

        $userCarrito = $this->persistenciaService->obtenerPorUserId($userId);

        if (! $userCarrito) {
            $userCarrito = $this->persistenciaService->crear($userId, null, $codCliente);
        }

        return DB::transaction(function () use ($guestCarrito, $userCarrito, $userId) {
            foreach ($guestCarrito->detalles as $detalle) {
                $producto = Producto::where('cod_producto', $detalle->cod_producto)
                    ->where('estado_pro', 'activo')
                    ->first();

                if (! $producto) {
                    continue;
                }

                $detalleDestino = $this->persistenciaService->agregarDetalle($userCarrito, [
                    'cod_producto' => $detalle->cod_producto,
                    'cod_variante_producto' => $detalle->cod_variante_producto,
                    'cantidad' => $detalle->cantidad_dca,
                    'precio_unitario' => (float) $detalle->precio_unitario_dca,
                    'nombre_snapshot' => $producto->nombre_pro,
                    'sku_snapshot' => $detalle->sku_producto_dca ?? $producto->sku_pro,
                ]);

                $reservaInvitado = $this->reservaService->obtenerReservaPorDetalle($detalle->cod_detalle_carrito);
                if (! $reservaInvitado) {
                    continue;
                }

                $reservaDestino = $this->reservaService->obtenerReservaPorDetalle($detalleDestino->cod_detalle_carrito);
                if ($reservaDestino) {
                    $this->reservaService->actualizarCantidadReserva($reservaDestino, $detalleDestino->cantidad_dca);
                    $this->reservaService->liberarReserva($reservaInvitado);
                } else {
                    $reservaInvitado->update([
                        'cod_carrito' => $userCarrito->cod_carrito,
                        'cod_detalle_carrito' => $detalleDestino->cod_detalle_carrito,
                        'user_id' => $userId,
                        'session_id_res' => null,
                    ]);
                }
            }

            $guestCarrito->update(['estado_car' => EstadoCarritoEnum::ABANDONADO]);
            $this->calculoService->recalcularSubtotales($userCarrito);

            return $userCarrito->load(['detalles.variante.talla']);
        });
    }
}
