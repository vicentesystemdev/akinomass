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

    public function after(): array
    {
        return [
            function (\Illuminate\Validation\Validator $validator): void {
                if ($validator->errors()->has('cod_producto') || $validator->errors()->has('cantidad_mov')) {
                    return;
                }

                $codProducto = $this->input('cod_producto');
                $producto = \App\Models\Producto::find($codProducto);
                if ($producto && !str_starts_with($producto->sku_pro ?? '', 'GEN-CAT-')) {
                    $inventario = \App\Models\Inventario::where('cod_producto', $codProducto)->first();
                    $stockActual = $inventario ? (int) $inventario->stock_actual_inv : 0;
                    $cantidad = (int) $this->input('cantidad_mov');

                    $route = request()->route();
                    if ($route && str_contains($route->getName(), 'entrada')) {
                        if ($stockActual + $cantidad > 1) {
                            $validator->errors()->add(
                                'cantidad_mov',
                                'Cada producto representa una prenda única, por lo que su stock no puede ser mayor a 1.'
                            );
                        }
                    }
                }
            }
        ];
    }

    public function messages(): array
    {
        return [
            'cod_producto.required' => 'El producto es obligatorio.',
            'cod_producto.exists' => 'El producto seleccionado no existe.',
            'cantidad_mov.required' => 'La cantidad es obligatoria.',
            'cantidad_mov.integer' => 'La cantidad debe ser un número entero.',
            'cantidad_mov.min' => 'La cantidad debe ser mayor a 0.',
            'motivo_mov.required' => 'El motivo es obligatorio.',
            'motivo_mov.string' => 'El motivo debe ser texto.',
            'motivo_mov.max' => 'El motivo no puede superar los 255 caracteres.',
            'observacion_mov.string' => 'La observación debe ser texto.',
        ];
    }
}
