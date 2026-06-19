<?php

namespace App\Http\Requests\Productos;

use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use App\Models\VarianteProducto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('productos.crear') ?? false;
    }

    public function rules(): array
    {
        return [
            'cod_categoria_producto' => [
                'required',
                Rule::exists('categorias_producto', 'cod_categoria_producto')->where('activo_cat', true),
            ],
            'nombre_pro' => ['required', 'string', 'max:255'],
            'descripcion_pro' => ['nullable', 'string'],
            'precio_venta_pro' => ['required', 'numeric', 'gt:0', 'regex:/^\d+(\.\d)?$/'],
            'precio_costo_pro' => ['nullable', 'numeric', 'gt:0', 'regex:/^\d+(\.\d)?$/'],
            'sku_pro' => ['nullable', 'string', 'max:100', Rule::unique('productos', 'sku_pro')],
            'imagen_pro' => $this->hasFile('imagen_pro')
                ? ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048']
                : ['nullable'],
            'estado_pro' => ['required', Rule::enum(EstadoProductoEnum::class)],
            'variantes' => ['nullable', 'array'],
            'variantes.*.cod_talla_producto' => ['required', 'integer', 'exists:tallas_producto,cod_talla_producto'],
            'variantes.*.sku_variante_producto' => ['nullable', 'string', 'max:100'],
            'variantes.*.precio_venta_variante' => ['nullable', 'numeric', 'gt:0', 'regex:/^\d+(\.\d)?$/'],
            'variantes.*.estado_variante_producto' => ['nullable', Rule::enum(EstadoProductoEnum::class)],
            'variantes.*.activo_variante_producto' => ['nullable', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('estado_pro')) {
            $this->merge(['estado_pro' => EstadoProductoEnum::ACTIVO->value]);
        }
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if (
                    $this->filled('precio_costo_pro')
                    && is_numeric($this->input('precio_venta_pro'))
                    && is_numeric($this->input('precio_costo_pro'))
                    && (float) $this->input('precio_venta_pro') < (float) $this->input('precio_costo_pro')
                ) {
                    $validator->errors()->add(
                        'precio_venta_pro',
                        'El precio de venta debe ser mayor o igual al precio de costo.',
                    );
                }

                $variantes = $this->input('variantes', []);
                $tallas = [];
                $skus = [];

                foreach ($variantes as $indice => $variante) {
                    $codTalla = $variante['cod_talla_producto'] ?? null;
                    $sku = trim((string) ($variante['sku_variante_producto'] ?? ''));

                    if ($codTalla && in_array((string) $codTalla, $tallas, true)) {
                        $validator->errors()->add(
                            "variantes.{$indice}.cod_talla_producto",
                            'Este producto ya tiene una variante registrada con esa talla.',
                        );
                    }
                    $tallas[] = (string) $codTalla;

                    if ($sku !== '' && in_array(mb_strtolower($sku), $skus, true)) {
                        $validator->errors()->add(
                            "variantes.{$indice}.sku_variante_producto",
                            'El SKU de la variante ya está registrado.',
                        );
                    }
                    $skus[] = mb_strtolower($sku);

                    if ($sku !== '' && VarianteProducto::where('sku_variante_producto', $sku)->exists()) {
                        $validator->errors()->add(
                            "variantes.{$indice}.sku_variante_producto",
                            'El SKU de la variante ya está registrado.',
                        );
                    }
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'cod_categoria_producto.required' => 'La categoría es obligatoria.',
            'cod_categoria_producto.exists' => 'La categoría seleccionada no existe o está inactiva.',
            'nombre_pro.required' => 'El nombre del producto es obligatorio.',
            'nombre_pro.string' => 'El nombre del producto debe ser texto.',
            'nombre_pro.max' => 'El nombre del producto no puede superar los 255 caracteres.',
            'descripcion_pro.string' => 'La descripción del producto debe ser texto.',
            'precio_venta_pro.required' => 'El precio de venta es obligatorio.',
            'precio_venta_pro.numeric' => 'El precio de venta debe ser numérico.',
            'precio_venta_pro.gt' => 'El precio de venta debe ser mayor a 0.',
            'precio_venta_pro.gte' => 'El precio de venta debe ser mayor o igual al precio de costo.',
            'precio_venta_pro.regex' => 'El precio de venta no puede tener más de un decimal (ej: 10.5).',
            'precio_costo_pro.numeric' => 'El precio de costo debe ser numérico.',
            'precio_costo_pro.gt' => 'El precio de costo debe ser mayor a 0.',
            'precio_costo_pro.regex' => 'El precio de costo no puede tener más de un decimal (ej: 10.5).',
            'sku_pro.string' => 'El SKU debe ser texto.',
            'sku_pro.max' => 'El SKU no puede superar los 100 caracteres.',
            'sku_pro.unique' => 'El SKU ya está registrado.',
            'imagen_pro.file' => 'La imagen del producto debe ser un archivo.',
            'imagen_pro.image' => 'El archivo seleccionado debe ser una imagen.',
            'imagen_pro.mimes' => 'La imagen debe tener formato JPG, JPEG, PNG o WEBP.',
            'imagen_pro.max' => 'La imagen no puede superar los 2 MB.',
            'estado_pro.required' => 'El estado del producto es obligatorio.',
            'estado_pro.enum' => 'El estado del producto no es válido.',
            'variantes.array' => 'Las variantes del producto no tienen un formato válido.',
            'variantes.*.cod_talla_producto.required' => 'La talla seleccionada es obligatoria.',
            'variantes.*.cod_talla_producto.integer' => 'La talla seleccionada no es válida.',
            'variantes.*.cod_talla_producto.exists' => 'La talla seleccionada no existe.',
            'variantes.*.sku_variante_producto.string' => 'El SKU de la variante debe ser texto.',
            'variantes.*.sku_variante_producto.max' => 'El SKU de la variante no puede superar los 100 caracteres.',
            'variantes.*.precio_venta_variante.numeric' => 'El precio de la variante debe ser numérico.',
            'variantes.*.precio_venta_variante.gt' => 'El precio de la variante debe ser mayor a 0.',
            'variantes.*.precio_venta_variante.regex' => 'El precio de la variante no puede tener más de un decimal (ej: 10.5).',
            'variantes.*.estado_variante_producto.enum' => 'El estado de la variante no es válido.',
            'variantes.*.activo_variante_producto.boolean' => 'El estado activo de la variante no es válido.',
        ];
    }
}
