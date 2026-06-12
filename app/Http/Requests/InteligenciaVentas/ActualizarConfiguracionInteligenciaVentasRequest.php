<?php

namespace App\Http\Requests\InteligenciaVentas;

use App\Domains\InteligenciaVentas\Enums\TipoPeriodoAnalisisEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActualizarConfiguracionInteligenciaVentasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('reportes.ver') ?? false;
    }

    public function rules(): array
    {
        return [
            'dias_analisis' => ['required', 'integer', 'min:30', 'max:365'],
            'periodo_agrupacion' => ['required', Rule::enum(TipoPeriodoAnalisisEnum::class)],
            'umbral_indice_demanda_baja' => ['required', 'numeric', 'min:0'],
            'umbral_indice_demanda_alta' => ['required', 'numeric', 'gt:umbral_indice_demanda_baja'],
            'porcentaje_stock_seguridad' => ['required', 'numeric', 'min:0', 'max:100'],
            'stock_seguridad_minimo' => ['required', 'integer', 'min:0'],
            'limite_factor_tendencia_min' => ['required', 'numeric', 'min:0'],
            'limite_factor_tendencia_max' => ['required', 'numeric', 'gt:limite_factor_tendencia_min'],
            'peso_transicion_demanda' => ['required', 'numeric', 'min:0'],
            'peso_tendencia' => ['required', 'numeric', 'min:0'],
            'peso_rotacion' => ['required', 'numeric', 'min:0'],
            'peso_canal' => ['required', 'numeric', 'min:0'],
            'activo' => ['nullable', 'boolean'],
        ];
    }
}
