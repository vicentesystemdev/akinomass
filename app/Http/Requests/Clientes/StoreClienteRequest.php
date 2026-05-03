<?php

namespace App\Http\Requests\Clientes;

use App\Domains\CRM\Clientes\Enums\EstadoClienteEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('clientes.crear') ?? false;
    }

    public function rules(): array
    {
        return [
            'nombre_cli' => ['required', 'string', 'max:255'],
            'telefono_cli' => ['nullable', 'string', 'max:50'],
            'correo_cli' => ['nullable', 'email', 'max:255'],
            'direccion_cli' => ['nullable', 'string', 'max:255'],
            'documento_cli' => ['nullable', 'string', 'max:100'],
            'observacion_cli' => ['nullable', 'string'],
            'estado_cli' => ['required', Rule::enum(EstadoClienteEnum::class)],
            'cod_canal_venta' => ['required', 'exists:canales_venta,cod_canal_venta'],
            'cod_tipo_flujo_comercial' => ['required', 'exists:tipos_flujo_comercial,cod_tipo_flujo_comercial'],
        ];
    }
}
