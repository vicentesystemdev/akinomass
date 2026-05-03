<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class RegistrarMovimientoInventarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('inventario.ajustar') ?? false;
    }

    public function rules(): array
    {
        return [
            'cod_producto' => ['required', 'exists:productos,cod_producto'],
            'cantidad_mov' => ['required', 'integer', 'min:1'],
            'motivo_mov' => ['required', 'string', 'max:255'],
            'observacion_mov' => ['nullable', 'string'],
        ];
    }
}
