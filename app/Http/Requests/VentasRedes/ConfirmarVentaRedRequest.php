<?php

namespace App\Http\Requests\VentasRedes;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmarVentaRedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('pedidos.editar') ?? false;
    }

    public function rules(): array
    {
        return [
            'observacion' => ['nullable', 'string'],
        ];
    }
}
