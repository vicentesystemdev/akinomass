<?php

namespace App\Http\Requests\Inventario;

use App\Models\VarianteProducto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'cod_variante_producto' => ['nullable', 'integer', 'exists:variantes_producto,cod_variante_producto'],
            'stock_minimo_inv' => ['nullable', 'integer', 'min:0'],
            'ubicacion_inv' => ['nullable', 'string', 'max:255'],
            'activo_inv' => ['nullable', 'boolean'],
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

                $pertenece = VarianteProducto::where('cod_variante_producto', $codVariante)
                    ->where('cod_producto', $this->input('cod_producto'))
                    ->exists();

                if (! $pertenece) {
                    $validator->errors()->add(
                        'cod_variante_producto',
                        'La variante seleccionada no pertenece al producto indicado.',
                    );
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
            'stock_minimo_inv.integer' => 'El stock mínimo debe ser un número entero.',
            'stock_minimo_inv.min' => 'El stock mínimo no puede ser negativo.',
            'ubicacion_inv.string' => 'La ubicación debe ser texto.',
            'ubicacion_inv.max' => 'La ubicación no puede superar los 255 caracteres.',
            'activo_inv.boolean' => 'El estado del inventario no es válido.',
        ];
    }
}
