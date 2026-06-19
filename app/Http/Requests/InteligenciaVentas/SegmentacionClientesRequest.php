<?php

declare(strict_types=1);

namespace App\Http\Requests\InteligenciaVentas;

use Illuminate\Foundation\Http\FormRequest;

final class SegmentacionClientesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('reportes.ver') ?? false;
    }

    public function rules(): array
    {
        return [
            'clusters' => ['nullable', 'integer', 'min:2', 'max:6'],
            'periodo_inicio' => ['nullable', 'date'],
            'periodo_fin' => ['nullable', 'date', 'after_or_equal:periodo_inicio'],
        ];
    }
}
