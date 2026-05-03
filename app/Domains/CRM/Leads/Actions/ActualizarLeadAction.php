<?php

namespace App\Domains\CRM\Leads\Actions;

use App\Models\Lead;

class ActualizarLeadAction
{
    public function execute(Lead $lead, array $data): Lead
    {
        $lead->update($data);

        return $lead->refresh();
    }
}
