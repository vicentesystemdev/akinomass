<?php

namespace App\Domains\Tienda\Configuracion\Actions;

use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;
use Illuminate\Support\Facades\DB;

class ActualizarConfiguracionTiendaAction
{
    public function __construct(
        private ConfiguracionTiendaService $configService,
    ) {}

    public function execute(int $userId, array $valores): void
    {
        DB::transaction(function () use ($userId, $valores) {
            foreach ($valores as $clave => $valor) {
                $this->configService->actualizarValor(
                    clave: $clave,
                    valor: is_bool($valor) ? ($valor ? 'true' : 'false') : (string) $valor,
                    userId: $userId,
                );
            }
        });
    }
}
