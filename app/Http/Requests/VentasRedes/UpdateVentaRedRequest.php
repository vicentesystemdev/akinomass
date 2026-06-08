<?php

namespace App\Http\Requests\VentasRedes;

class UpdateVentaRedRequest extends StoreVentaRedRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('pedidos.editar') ?? false;
    }
}
