<?php

namespace App\Http\Requests\Leads;

use App\Domains\CRM\Leads\Enums\EstadoLeadEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('leads.crear') ?? false;
    }

    public function rules(): array
    {
        return [
            'nombre_lea' => ['required', 'string', 'max:255'],
            'alias_lea' => ['nullable', 'string', 'max:255'],
            'telefono_lea' => ['nullable', 'string', 'max:50'],
            'correo_lea' => ['nullable', 'email', 'max:255'],
            'producto_interes_lea' => ['nullable', 'string', 'max:255'],
            'observacion_lea' => ['nullable', 'string'],
            'estado_lea' => ['required', Rule::enum(EstadoLeadEnum::class)],
            'fecha_seguimiento_lea' => ['nullable', 'date'],
            'cod_canal_venta' => ['required', 'exists:canales_venta,cod_canal_venta'],
            'cod_tipo_flujo_comercial' => ['required', 'exists:tipos_flujo_comercial,cod_tipo_flujo_comercial'],
            'cod_usuario_responsable' => ['nullable', 'exists:users,id'],
        ];
    }
}
