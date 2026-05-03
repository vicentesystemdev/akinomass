<?php

namespace App\Http\Requests\PlantillasMensaje;

use App\Domains\CRM\Plantillas\Enums\TipoPlantillaMensajeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlantillaMensajeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.crear') ?? false;
    }

    public function rules(): array
    {
        return [
            'nombre_pla' => ['required', 'string', 'max:255'],
            'tipo_pla' => ['required', Rule::enum(TipoPlantillaMensajeEnum::class)],
            'contenido_pla' => ['required', 'string'],
            'activo_pla' => ['nullable', 'boolean'],
        ];
    }
}
