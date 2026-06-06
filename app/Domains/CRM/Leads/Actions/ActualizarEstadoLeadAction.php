<?php

namespace App\Domains\CRM\Leads\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\Lead;

class ActualizarEstadoLeadAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(Lead $lead, string $estado): Lead
    {
        $anterior = $lead->estado_lea;
        $lead->update(['estado_lea' => $estado]);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarAccion(
            $contexto, 'CRM', 'leads', (string) $lead->cod_lead, 'cambio_estado',
            submodulo: 'Cambio de estado',
            accionFuncional: 'Cambio de estado de lead',
            descripcion: "El lead #{$lead->cod_lead} cambió de estado: {$anterior} → {$estado}.",
            campo: 'estado_lea',
            valorAnterior: $anterior instanceof \BackedEnum ? $anterior->value : $anterior,
            valorNuevo: $estado,
        );

        return $lead->refresh();
    }
}
