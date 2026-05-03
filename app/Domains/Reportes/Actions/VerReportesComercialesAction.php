<?php

namespace App\Domains\Reportes\Actions;

use App\Domains\Reportes\Services\ReporteComercialService;

class VerReportesComercialesAction
{
    public function __construct(
        private readonly ReporteComercialService $service,
    ) {
    }

    public function execute(array $filtros): array
    {
        return $this->service->obtenerReportes($filtros);
    }
}
