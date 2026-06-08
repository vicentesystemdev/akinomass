<?php

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\InteligenciaVentas\Repositories\ConfiguracionInteligenciaVentasRepository;
use App\Models\ConfiguracionInteligenciaVentas;

class ActualizarConfiguracionInteligenciaVentasAction
{
    public function __construct(
        private readonly ConfiguracionInteligenciaVentasRepository $repository,
        private readonly RegistrarAuditoriaService $auditoria,
    ) {}

    public function execute(array $data): ConfiguracionInteligenciaVentas
    {
        $configuracion = $this->repository->actualizar($data);
        $this->auditoria->registrarAccion(
            RegistrarAuditoriaData::fromRequest(request()),
            'InteligenciaVentas',
            'configuracion_inteligencia_ventas',
            (string) $configuracion->cod_configuracion_inteligencia_ventas,
            'update',
            submodulo: 'Configuracion',
            accionFuncional: 'Cambio de configuracion',
            descripcion: 'Se actualizo la configuracion de inteligencia de ventas.',
        );

        return $configuracion;
    }
}
