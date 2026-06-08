<?php

namespace App\Http\Requests\VentasRedes;

use Illuminate\Foundation\Http\FormRequest;

class ConvertirVentaRedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('pedidos.crear') ?? false;
    }

    public function rules(): array
    {
        return [
            'observacion' => ['nullable', 'string'],
        ];
    }
}
