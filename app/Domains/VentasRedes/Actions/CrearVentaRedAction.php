<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Domains\VentasRedes\Services\VentaRedService;
use App\Models\VentaRed;

class CrearVentaRedAction
{
    public function __construct(
        private readonly VentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(array $data): VentaRed
    {
        $ventaRed = $this->service->crear($data);
        $this->trazabilidad->registrarCreacion($ventaRed);

        return $ventaRed;
    }
}
