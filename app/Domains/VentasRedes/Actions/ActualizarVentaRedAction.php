<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Domains\VentasRedes\Services\VentaRedService;
use App\Models\VentaRed;

class ActualizarVentaRedAction
{
    public function __construct(
        private readonly VentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(VentaRed $ventaRed, array $data): VentaRed
    {
        $actualizada = $this->service->actualizar($ventaRed, $data);
        $this->trazabilidad->registrarAccion($actualizada, 'update', 'Se actualizo la venta por redes.');

        return $actualizada;
    }
}
