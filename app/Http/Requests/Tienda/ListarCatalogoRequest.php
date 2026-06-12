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
            'cod_talla_producto' => ['nullable', 'integer', 'exists:tallas_producto,cod_talla_producto'],
            'orden' => ['nullable', 'string', 'in:precio_asc,precio_desc,nombre_asc,recientes'],
            'solo_disponibles' => ['nullable', 'boolean'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:12', 'max:48'],
        ];
    }

    public function messages(): array
    {
        return [
            'q.max' => 'La bÃºsqueda no puede superar los 100 caracteres.',
            'cod_categoria_producto.exists' => 'La categorÃ­a seleccionada no existe.',
            'cod_talla_producto.exists' => 'La talla seleccionada no existe.',
            'orden.in' => 'El orden seleccionado no es vÃ¡lido.',
            'solo_disponibles.boolean' => 'El filtro de disponibilidad no es vÃ¡lido.',
            'page.min' => 'La pÃ¡gina solicitada no es vÃ¡lida.',
            'per_page.min' => 'Debe mostrar al menos 12 productos por pÃ¡gina.',
            'per_page.max' => 'No puede mostrar mÃ¡s de 48 productos por pÃ¡gina.',
        ];
    }
}
