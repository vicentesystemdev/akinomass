<?php

namespace App\Domains\Tienda\Configuracion\Actions;

use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;

class LimpiarCacheConfiguracionTiendaAction
{
    public function __construct(
        private ConfiguracionTiendaService $configService,
    ) {}

    public function execute(): void
    {
        $this->configService->limpiarCache();
    }
}
