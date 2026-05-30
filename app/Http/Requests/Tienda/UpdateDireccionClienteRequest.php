<?php

namespace App\Http\Requests\Tienda;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDireccionClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('cuenta.gestionar_direcciones') ?? false;
    }

    public function rules(): array
    {
        return [
            'etiqueta_dir' => ['sometimes', 'required', 'string', 'max:50'],
            'nombre_destinatario_dir' => ['sometimes', 'required', 'string', 'max:255'],
            'telefono_dir' => ['nullable', 'string', 'max:30'],
            'direccion_dir' => ['sometimes', 'required', 'string'],
            'ciudad_dir' => ['nullable', 'string', 'max:100'],
            'departamento_dir' => ['nullable', 'string', 'max:100'],
            'codigo_postal_dir' => ['nullable', 'string', 'max:20'],
            'referencia_dir' => ['nullable', 'string'],
            'documento_nit_dir' => ['nullable', 'string', 'max:30'],
            'razon_social_dir' => ['nullable', 'string', 'max:255'],
            'es_predeterminada_dir' => ['nullable', 'boolean'],
        ];
    }
}
