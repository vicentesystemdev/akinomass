<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Domains\VentasRedes\Services\VentaRedService;
use App\Models\VentaRed;

class CancelarVentaRedAction
{
    public function __construct(
        private readonly VentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(VentaRed $ventaRed): VentaRed
    {
        $actualizada = $this->service->cancelar($ventaRed);
        $this->trazabilidad->registrarAccion($actualizada, 'cancelar', 'Se cancelo la venta por redes.');

        return $actualizada;
    }
}
