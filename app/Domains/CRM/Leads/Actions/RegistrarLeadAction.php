<?php

namespace App\Domains\CRM\Leads\Actions;

use App\Models\Lead;

class RegistrarLeadAction
{
    public function execute(array $data): Lead
    {
        return Lead::create($data);
    }
}
