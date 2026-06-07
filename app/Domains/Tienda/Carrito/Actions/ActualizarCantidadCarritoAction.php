<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Services\CarritoCalculoService;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Carrito\Services\StockDisponibleTiendaService;
use App\Models\DetalleCarrito;
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

            $stockDisponible = $this->stockDisponibleService->obtenerStockDisponible($detalle->cod_producto);

            $cantidadPrevia = (int) $detalle->cantidad_dca;
            $diferencia = $cantidad - $cantidadPrevia;

            if ($diferencia > 0 && $stockDisponible < $diferencia) {
                throw ValidationException::withMessages([
                    'cantidad' => ['Stock insuficiente. Disponible adicional: ' . $stockDisponible],
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
