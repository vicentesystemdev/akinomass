<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Carrito\Services\CarritoCalculoService;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Models\Carrito;
use App\Models\Producto;

class MergeCarritoInvitadoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
        private CarritoCalculoService $calculoService,
    ) {}

    public function execute(string $guestSessionId, int $userId, ?int $codCliente): ?Carrito
    {
        $guestCarrito = $this->persistenciaService->obtenerPorSessionId($guestSessionId);

        if (!$guestCarrito || $guestCarrito->detalles->isEmpty()) {
            return $this->persistenciaService->obtenerPorUserId($userId);
        }

        $userCarrito = $this->persistenciaService->obtenerPorUserId($userId);

        if (!$userCarrito) {
            $userCarrito = $this->persistenciaService->crear($userId, null, $codCliente);
        }

        foreach ($guestCarrito->detalles as $detalle) {
            $producto = Producto::where('cod_producto', $detalle->cod_producto)
                ->where('estado_pro', 'activo')
                ->first();

            if (!$producto) {
                continue;
            }

            $this->persistenciaService->agregarDetalle($userCarrito, [
                'cod_producto' => $detalle->cod_producto,
                'cantidad' => $detalle->cantidad_dca,
                'precio_unitario' => (float) $producto->precio_venta_pro,
                'nombre_snapshot' => $producto->nombre_pro,
                'sku_snapshot' => $producto->sku_pro,
            ]);
        }

        $guestCarrito->update(['estado_car' => EstadoCarritoEnum::ABANDONADO]);

        $this->calculoService->recalcularSubtotales($userCarrito);

        return $userCarrito->load('detalles');
    }
}
