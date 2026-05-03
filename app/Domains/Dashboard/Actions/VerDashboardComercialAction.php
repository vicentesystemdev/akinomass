<?php

namespace App\Domains\Dashboard\Actions;

use App\Domains\Dashboard\Services\DashboardComercialService;

class VerDashboardComercialAction
{
    public function __construct(
        private readonly DashboardComercialService $service,
    ) {
    }

    public function execute(): array
    {
        return $this->service->obtenerMetricas();
    }
}
