<?php

namespace App\Domains\CRM\Plantillas\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\PlantillaMensaje;

class CrearPlantillaMensajeAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(array $data): PlantillaMensaje
    {
        $data['activo_pla'] = $data['activo_pla'] ?? true;
        $plantilla = PlantillaMensaje::create($data);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarInsercion($contexto, 'CRM', 'plantillas_mensaje', (string) $plantilla->cod_plantilla_mensaje);

        return $plantilla;
    }
}
