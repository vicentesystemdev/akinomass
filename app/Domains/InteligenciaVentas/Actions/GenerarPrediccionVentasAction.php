<?php

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\InteligenciaVentas\Services\InteligenciaVentasService;
use Illuminate\Support\Collection;

class GenerarPrediccionVentasAction
{
    public function __construct(
        private readonly InteligenciaVentasService $service,
        private readonly RegistrarAuditoriaService $auditoria,
    ) {}

    public function execute(array $parametros = []): Collection
    {
        $resultado = $this->service->generar($parametros);
        $this->auditoria->registrarAccion(
            RegistrarAuditoriaData::fromRequest(request()),
            'InteligenciaVentas',
            'predicciones_ventas',
            'batch',
            'generar',
            submodulo: 'Predicciones',
            accionFuncional: 'Generacion de predicciones',
            descripcion: 'Se generaron predicciones de ventas y recomendaciones de abastecimiento.',
        );

        return $resultado;
    }
}
