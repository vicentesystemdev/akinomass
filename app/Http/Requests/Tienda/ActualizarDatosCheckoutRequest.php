<?php

namespace App\Http\Requests\Tienda;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarDatosCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email_contacto' => ['required', 'email', 'max:255'],
            'telefono_contacto' => ['nullable', 'string', 'max:30'],
            'cod_direccion_cliente' => ['nullable', 'integer', 'exists:direcciones_cliente,cod_direccion_cliente'],
            'direccion_entrega' => ['nullable', 'string', 'max:500'],
            'documento_facturacion' => ['nullable', 'string', 'max:30'],
            'razon_social' => ['nullable', 'string', 'max:255'],
        ];
    }
}
