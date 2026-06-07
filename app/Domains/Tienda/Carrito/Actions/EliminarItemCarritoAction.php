<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Services\CarritoCalculoService;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Models\DetalleCarrito;
use Illuminate\Support\Facades\DB;

class EliminarItemCarritoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
        private CarritoCalculoService $calculoService,
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(DetalleCarrito $detalle): void
    {
        DB::transaction(function () use ($detalle) {
            $carrito = $detalle->carrito;

            $reserva = $this->reservaService->obtenerReservaPorDetalle($detalle->cod_detalle_carrito);

            $this->persistenciaService->eliminarDetalle($detalle->cod_detalle_carrito);

            if ($reserva) {
                $this->reservaService->liberarReserva($reserva);
            }

            $this->calculoService->recalcularSubtotales($carrito);
        });
    }
}
