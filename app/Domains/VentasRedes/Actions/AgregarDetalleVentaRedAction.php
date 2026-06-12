<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Services\DetalleVentaRedService;
use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Models\VentaRed;
use App\Models\VentaRedDetalle;

class AgregarDetalleVentaRedAction
{
    public function __construct(
        private readonly DetalleVentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(VentaRed $ventaRed, array $data): VentaRedDetalle
    {
        $detalle = $this->service->agregar($ventaRed, $data);
        $this->trazabilidad->registrarAccion($ventaRed, 'agregar_detalle', 'Se agrego un producto a la venta por redes.');

        return $detalle;
    }
}
