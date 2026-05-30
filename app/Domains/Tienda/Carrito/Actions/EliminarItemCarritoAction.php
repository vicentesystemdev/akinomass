<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Services\CarritoCalculoService;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Models\DetalleCarrito;

class EliminarItemCarritoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
        private CarritoCalculoService $calculoService,
    ) {}

    public function execute(DetalleCarrito $detalle): void
    {
        $carrito = $detalle->carrito;

        $this->persistenciaService->eliminarDetalle($detalle->cod_detalle_carrito);

        $this->calculoService->recalcularSubtotales($carrito);
    }
}
