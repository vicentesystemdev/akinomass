<?php

namespace App\Http\Requests\Leads;

use App\Domains\CRM\Leads\Enums\EstadoLeadEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEstadoLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.editar') ?? false;
    }

    public function rules(): array
    {
        return ['estado_lea' => ['required', Rule::enum(EstadoLeadEnum::class)]];
    }
}
