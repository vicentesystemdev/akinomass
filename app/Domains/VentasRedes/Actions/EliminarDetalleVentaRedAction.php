<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Services\DetalleVentaRedService;
use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Models\VentaRed;
use App\Models\VentaRedDetalle;

class EliminarDetalleVentaRedAction
{
    public function __construct(
        private readonly DetalleVentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(VentaRed $ventaRed, VentaRedDetalle $detalle): void
    {
        $this->service->eliminar($ventaRed, $detalle);
        $this->trazabilidad->registrarAccion($ventaRed, 'eliminar_detalle', 'Se elimino un producto de la venta por redes.');
    }
}
