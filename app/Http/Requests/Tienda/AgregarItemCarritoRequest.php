<?php

namespace App\Http\Requests\Tienda;

use Illuminate\Foundation\Http\FormRequest;

class AgregarItemCarritoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cod_producto' => ['required', 'integer', 'exists:productos,cod_producto'],
            'cantidad' => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }
}
