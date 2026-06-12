<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Services\DetalleVentaRedService;
use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Models\VentaRed;
use App\Models\VentaRedDetalle;

class ActualizarDetalleVentaRedAction
{
    public function __construct(
        private readonly DetalleVentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(VentaRed $ventaRed, VentaRedDetalle $detalle, array $data): VentaRedDetalle
    {
        $detalle = $this->service->actualizar($ventaRed, $detalle, $data);
        $this->trazabilidad->registrarAccion($ventaRed, 'actualizar_detalle', 'Se actualizo un producto de la venta por redes.');

        return $detalle;
    }
}
