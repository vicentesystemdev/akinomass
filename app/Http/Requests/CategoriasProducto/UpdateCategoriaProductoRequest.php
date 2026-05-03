<?php

namespace App\Http\Requests\CategoriasProducto;

use Illuminate\Foundation\Http\FormRequest;

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
}
