<?php

namespace App\Http\Requests\InteligenciaVentas;

use App\Domains\InteligenciaVentas\Enums\TipoPeriodoAnalisisEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerarPrediccionVentasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('reportes.ver') ?? false;
    }

    public function rules(): array
    {
        return [
            'periodo_inicio' => ['nullable', 'date'],
            'periodo_fin' => ['nullable', 'date', 'after_or_equal:periodo_inicio'],
            'dias_analisis' => ['nullable', 'integer', 'min:30', 'max:365'],
            'tipo_periodo' => ['nullable', Rule::enum(TipoPeriodoAnalisisEnum::class)],
        ];
    }
}
