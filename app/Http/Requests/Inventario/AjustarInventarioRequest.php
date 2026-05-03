<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class AjustarInventarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('inventario.ajustar') ?? false;
    }

    public function rules(): array
    {
        return [
            'cod_producto' => ['required', 'exists:productos,cod_producto'],
            'stock_nuevo_mov' => ['required', 'integer', 'min:0'],
            'motivo_mov' => ['required', 'string', 'max:255'],
            'observacion_mov' => ['nullable', 'string'],
        ];
    }
}
