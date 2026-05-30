<?php

namespace App\Http\Requests\Tienda;

use Illuminate\Foundation\Http\FormRequest;

class ListarCatalogoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:100'],
            'cod_categoria_producto' => ['nullable', 'integer', 'exists:categorias_producto,cod_categoria_producto'],
            'orden' => ['nullable', 'string', 'in:precio_asc,precio_desc,nombre_asc,recientes'],
            'solo_disponibles' => ['nullable', 'boolean'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:12', 'max:48'],
        ];
    }
}
