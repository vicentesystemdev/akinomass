<?php

namespace App\Http\Requests\Leads;

class UpdateLeadRequest extends StoreLeadRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.editar') ?? false;
    }
}
