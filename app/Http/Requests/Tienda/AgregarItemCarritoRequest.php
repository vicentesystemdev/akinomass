<?php

namespace App\Http\Requests\Tienda;

use App\Models\Producto;
use App\Models\VarianteProducto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'cod_variante_producto' => ['nullable', 'integer', 'exists:variantes_producto,cod_variante_producto'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            $producto = Producto::withCount(['variantes' => fn ($query) => $query->where('activo_variante_producto', true)->where('estado_variante_producto', 'activo')])
                ->find($this->input('cod_producto'));
            $codVariante = $this->input('cod_variante_producto');

            if ($producto?->variantes_count > 0 && ! $codVariante) {
                $validator->errors()->add('cod_variante_producto', 'Debes seleccionar una talla antes de agregar el producto.');
            }
            if ($codVariante && ! VarianteProducto::where('cod_variante_producto', $codVariante)->where('cod_producto', $this->input('cod_producto'))->where('activo_variante_producto', true)->where('estado_variante_producto', 'activo')->exists()) {
                $validator->errors()->add('cod_variante_producto', 'La variante seleccionada no pertenece al producto o no está disponible.');
            }
        }];
    }

    public function messages(): array
    {
        return [
            'cod_producto.required' => 'El producto es obligatorio.',
            'cod_producto.exists' => 'El producto seleccionado no existe.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'cod_variante_producto.exists' => 'La variante seleccionada no existe.',
        ];
    }
}
