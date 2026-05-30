<?php

namespace App\Http\Requests\Tienda;

use Illuminate\Foundation\Http\FormRequest;

class GenerarPedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cod_checkout_sesion' => ['required', 'integer', 'exists:checkout_sesiones,cod_checkout_sesion'],
        ];
    }
}
