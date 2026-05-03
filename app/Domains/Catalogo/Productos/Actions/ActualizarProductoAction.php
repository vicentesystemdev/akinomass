<?php

namespace App\Domains\Catalogo\Productos\Actions;

use App\Models\Producto;

class ActualizarProductoAction
{
    public function execute(Producto $producto, array $data): Producto
    {
        $producto->update($data);

        return $producto;
    }
}
