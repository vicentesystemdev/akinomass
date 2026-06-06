<?php

namespace App\Domains\CRM\Plantillas\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\PlantillaMensaje;

class ActualizarPlantillaMensajeAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(PlantillaMensaje $plantillaMensaje, array $data): PlantillaMensaje
    {
        $original = $plantillaMensaje->getOriginal();
        $plantillaMensaje->update($data);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $changed = array_intersect_key($data, $original);
        $changed = array_filter($changed, fn($v, $k) => ($original[$k] ?? null) != $v, ARRAY_FILTER_USE_BOTH);

        if (!empty($changed)) {
            $this->auditoriaService->registrarCambios(
                $contexto, 'CRM', 'plantillas_mensaje', (string) $plantillaMensaje->cod_plantilla_mensaje,
                $original, $changed,
            );
        }

        return $plantillaMensaje->refresh();
    }
}
