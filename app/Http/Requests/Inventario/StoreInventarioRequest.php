<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('inventario.ajustar') ?? false;
    }

    public function rules(): array
    {
        return [
            'cod_producto' => ['required', 'exists:productos,cod_producto'],
            'stock_minimo_inv' => ['nullable', 'integer', 'min:0'],
            'ubicacion_inv' => ['nullable', 'string', 'max:255'],
            'activo_inv' => ['nullable', 'boolean'],
        ];
    }
}
