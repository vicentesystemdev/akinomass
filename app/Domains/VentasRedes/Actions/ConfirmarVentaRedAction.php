<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Domains\VentasRedes\Services\VentaRedService;
use App\Models\VentaRed;

class ConfirmarVentaRedAction
{
    public function __construct(
        private readonly VentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(VentaRed $ventaRed): VentaRed
    {
        $actualizada = $this->service->confirmar($ventaRed);
        $this->trazabilidad->registrarAccion($actualizada, 'confirmar', 'Se confirmo la venta por redes.');

        return $actualizada;
    }
}
