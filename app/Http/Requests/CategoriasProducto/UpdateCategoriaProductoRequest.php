<?php

namespace App\Http\Requests\CategoriasProducto;

use App\Models\CategoriaProducto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateCategoriaProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('productos.editar') ?? false;
    }

    public function rules(): array
    {
        return [
            'nombre_cat' => ['required', 'string', 'max:255'],
            'descripcion_cat' => ['nullable', 'string'],
            'activo_cat' => ['required', 'boolean'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->has('nombre_cat')) {
                    return;
                }

                $categoriaId = (int) $this->route('categorias_producto');
                $nombre = trim((string) $this->input('nombre_cat'));

                $existe = CategoriaProducto::whereRaw('LOWER(TRIM(nombre_cat)) = LOWER(?)', [$nombre])
                    ->where('cod_categoria_producto', '!=', $categoriaId)
                    ->exists();

                if ($existe) {
                    $validator->errors()->add('nombre_cat', 'Ya existe una categoría con este nombre.');
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_cat.required' => 'El nombre de la categoría es obligatorio.',
            'nombre_cat.string' => 'El nombre de la categoría debe ser texto.',
            'nombre_cat.max' => 'El nombre de la categoría no puede superar los 255 caracteres.',
            'descripcion_cat.string' => 'La descripción de la categoría debe ser texto.',
            'activo_cat.required' => 'Debes indicar si la categoría está activa.',
            'activo_cat.boolean' => 'El estado de la categoría no es válido.',
        ];
    }
}
