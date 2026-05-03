<?php

namespace App\Domains\Catalogo\Productos\Actions;

use App\Models\Producto;

class CrearProductoAction
{
    public function execute(array $data): Producto
    {
        return Producto::create($data);
    }
}
