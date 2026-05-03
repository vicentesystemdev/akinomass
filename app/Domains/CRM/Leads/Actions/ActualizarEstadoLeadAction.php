<?php

namespace App\Domains\CRM\Leads\Actions;

use App\Models\Lead;

class ActualizarEstadoLeadAction
{
    public function execute(Lead $lead, string $estado): Lead
    {
        $lead->update(['estado_lea' => $estado]);

        return $lead->refresh();
    }
}
