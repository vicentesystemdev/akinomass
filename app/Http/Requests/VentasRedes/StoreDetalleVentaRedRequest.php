<?php

namespace App\Http\Requests\VentasRedes;

use Illuminate\Foundation\Http\FormRequest;

class StoreDetalleVentaRedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('pedidos.editar') ?? false;
    }

    public function rules(): array
    {
        return [
            'cod_producto' => ['required', 'exists:productos,cod_producto'],
            'cod_variante_producto' => ['nullable', 'exists:variantes_producto,cod_variante_producto'],
            'cod_talla_producto' => ['nullable', 'exists:tallas_producto,cod_talla_producto'],
            'cantidad' => ['required', 'integer', 'min:1'],
            'precio_unitario' => ['required', 'numeric', 'min:0'],
            'observacion' => ['nullable', 'string'],
        ];
    }
}
