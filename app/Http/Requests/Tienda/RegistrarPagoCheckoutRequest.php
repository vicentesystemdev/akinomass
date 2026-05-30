<?php

namespace App\Http\Requests\Tienda;

use Illuminate\Foundation\Http\FormRequest;

class RegistrarPagoCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cod_checkout_sesion' => ['required', 'integer', 'exists:checkout_sesiones,cod_checkout_sesion'],
            'metodo_pago_pag' => ['required', 'string', 'in:qr,transferencia,efectivo,deposito,otro'],
            'referencia_pag' => ['nullable', 'string', 'max:150'],
            'banco_origen' => ['nullable', 'string', 'max:100'],
            'comprobante' => ['nullable', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf'],
        ];
    }
}
