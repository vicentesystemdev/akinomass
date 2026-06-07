<?php

namespace App\Http\Requests\Inventario;

use App\Models\VarianteProducto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'cod_variante_producto' => ['nullable', 'integer', 'exists:variantes_producto,cod_variante_producto'],
            'stock_nuevo_mov' => ['required', 'integer', 'min:0'],
            'motivo_mov' => ['required', 'string', 'max:255'],
            'observacion_mov' => ['nullable', 'string'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $codVariante = $this->input('cod_variante_producto');

                if (! $codVariante || $validator->errors()->has('cod_variante_producto')) {
                    return;
                }

                $pertenece = VarianteProducto::query()
                    ->where('cod_variante_producto', $codVariante)
                    ->where('cod_producto', $this->input('cod_producto'))
                    ->where('activo_variante_producto', true)
                    ->exists();

                if (! $pertenece) {
                    $validator->errors()->add('cod_variante_producto', 'La variante seleccionada no pertenece al producto o está inactiva.');
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'cod_producto.required' => 'El producto es obligatorio.',
            'cod_producto.exists' => 'El producto seleccionado no existe.',
            'cod_variante_producto.integer' => 'La variante seleccionada no es válida.',
            'cod_variante_producto.exists' => 'La variante seleccionada no existe.',
            'stock_nuevo_mov.required' => 'El nuevo stock es obligatorio.',
            'stock_nuevo_mov.integer' => 'El nuevo stock debe ser un número entero.',
            'stock_nuevo_mov.min' => 'El nuevo stock no puede ser negativo.',
            'motivo_mov.required' => 'El motivo es obligatorio.',
            'motivo_mov.string' => 'El motivo debe ser texto.',
            'motivo_mov.max' => 'El motivo no puede superar los 255 caracteres.',
            'observacion_mov.string' => 'La observación debe ser texto.',
        ];
    }
}
