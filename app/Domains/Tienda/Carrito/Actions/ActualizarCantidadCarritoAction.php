<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Services\CarritoCalculoService;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Carrito\Services\StockDisponibleTiendaService;
use App\Models\DetalleCarrito;
use App\Models\Inventario;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ActualizarCantidadCarritoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
        private CarritoCalculoService $calculoService,
        private StockDisponibleTiendaService $stockDisponibleService,
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(DetalleCarrito $detalle, int $cantidad): DetalleCarrito
    {
        return DB::transaction(function () use ($detalle, $cantidad) {
            $detalle->refresh();

            $inventario = Inventario::where('cod_producto', $detalle->cod_producto)
                ->when(
                    $detalle->cod_variante_producto,
                    fn ($q) => $q->where('cod_variante_producto', $detalle->cod_variante_producto),
                    fn ($q) => $q->whereNull('cod_variante_producto')
                )
                ->where('activo_inv', true)
                ->lockForUpdate()
                ->first();

            $stockFisico = $inventario ? (int) $inventario->stock_actual_inv : 0;
            $stockReservado = $this->reservaService->sumarReservasActivasPorProducto($detalle->cod_producto, $detalle->cod_variante_producto);
            $stockDisponible = max(0, $stockFisico - $stockReservado);

            $cantidadPrevia = (int) $detalle->cantidad_dca;
            $diferencia = $cantidad - $cantidadPrevia;

            if ($diferencia > 0 && $stockDisponible < $diferencia) {
                throw ValidationException::withMessages([
                    'cantidad' => ['Stock insuficiente. Disponible adicional: '.$stockDisponible],
                ]);
            }

            // Validar que para prendas únicas no se actualice la cantidad a más de 1
            $producto = \App\Models\Producto::find($detalle->cod_producto);
            if ($producto && !str_starts_with($producto->sku_pro ?? '', 'GEN-CAT-') && $cantidad > 1) {
                throw ValidationException::withMessages([
                    'cantidad' => ['Cada prenda es única, no puedes tener más de 1 unidad de este producto en tu carrito.'],
                ]);
            }

            $detalleActualizado = $this->persistenciaService->actualizarDetalle(
                $detalle->cod_detalle_carrito,
                $cantidad
            );

            $reserva = $this->reservaService->obtenerReservaPorDetalle($detalle->cod_detalle_carrito);

            if ($cantidad <= 0 && $reserva) {
                $this->reservaService->liberarReserva($reserva);
                $this->persistenciaService->eliminarDetalle($detalle->cod_detalle_carrito);
            } elseif ($reserva) {
                $this->reservaService->actualizarCantidadReserva($reserva, $cantidad);
            }

            $this->calculoService->recalcularSubtotales($detalle->carrito);

            return $detalleActualizado;
        });
    }
}
