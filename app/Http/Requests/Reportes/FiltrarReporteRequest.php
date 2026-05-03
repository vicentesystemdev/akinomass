<?php

namespace App\Http\Requests\Reportes;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FiltrarReporteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin' => ['nullable', 'date', 'after_or_equal:fecha_inicio'],
            'estado_pedido' => ['nullable', Rule::in(['borrador', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado', 'devuelto'])],
            'estado_pago' => ['nullable', Rule::in(['pendiente', 'pagado', 'observado', 'rechazado', 'reembolsado'])],
            'estado_lead' => ['nullable', Rule::in(['nuevo', 'contactado', 'interesado', 'pendiente_pago', 'convertido', 'perdido', 'descartado'])],
            'cod_canal_venta' => ['nullable', 'integer', 'exists:canales_venta,cod_canal_venta'],
            'cod_tipo_flujo_comercial' => ['nullable', 'integer', 'exists:tipos_flujo_comercial,cod_tipo_flujo_comercial'],
        ];
    }
}
