<?php

namespace App\Http\Requests\Productos;

use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use App\Models\Producto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('productos.editar') ?? false;
    }

    public function rules(): array
    {
        /** @var Producto $producto */
        $producto = $this->route('producto');

        return [
            'cod_categoria_producto' => ['required', 'exists:categorias_producto,cod_categoria_producto'],
            'nombre_pro' => ['required', 'string', 'max:255'],
            'descripcion_pro' => ['nullable', 'string'],
            'precio_venta_pro' => ['required', 'numeric', 'min:0'],
            'precio_costo_pro' => ['nullable', 'numeric', 'min:0'],
            'sku_pro' => ['nullable', 'string', 'max:100', Rule::unique('productos', 'sku_pro')->ignore($producto?->cod_producto, 'cod_producto')],
            'imagen_pro' => ['nullable', 'string', 'max:255'],
            'estado_pro' => ['required', Rule::enum(EstadoProductoEnum::class)],
        ];
    }
}
