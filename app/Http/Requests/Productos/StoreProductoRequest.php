<?php

namespace App\Http\Requests\Productos;

use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('productos.crear') ?? false;
    }

    public function rules(): array
    {
        return [
            'cod_categoria_producto' => ['required', 'exists:categorias_producto,cod_categoria_producto'],
            'nombre_pro' => ['required', 'string', 'max:255'],
            'descripcion_pro' => ['nullable', 'string'],
            'precio_venta_pro' => ['required', 'numeric', 'min:0'],
            'precio_costo_pro' => ['nullable', 'numeric', 'min:0'],
            'sku_pro' => ['nullable', 'string', 'max:100', 'unique:productos,sku_pro'],
            'imagen_pro' => $this->hasFile('imagen_pro')
                ? ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048']
                : ['nullable'],
            'estado_pro' => ['required', Rule::enum(EstadoProductoEnum::class)],
        ];
    }
}
