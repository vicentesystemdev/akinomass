<?php

namespace App\Domains\CRM\Leads\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\Lead;

class RegistrarLeadAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(array $data): Lead
    {
        $lead = Lead::create($data);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarInsercion($contexto, 'CRM', 'leads', (string) $lead->cod_lead);

        return $lead;
    }
}
