<?php

namespace App\Domains\Catalogo\Categorias\Actions;

use App\Models\CategoriaProducto;

class CrearCategoriaProductoAction
{
    public function execute(array $data): CategoriaProducto
    {
        return CategoriaProducto::create($data);
    }
}
