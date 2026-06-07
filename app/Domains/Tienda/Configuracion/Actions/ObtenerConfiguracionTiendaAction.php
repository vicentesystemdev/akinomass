<?php

namespace App\Domains\Tienda\Configuracion\Actions;

use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;

class ObtenerConfiguracionTiendaAction
{
    public function __construct(
        private ConfiguracionTiendaService $configService,
    ) {}

    public function execute(): array
    {
        return $this->configService->obtenerTodas();
    }
}
