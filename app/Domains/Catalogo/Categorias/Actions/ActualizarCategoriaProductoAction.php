<?php

namespace App\Domains\Catalogo\Categorias\Actions;

use App\Models\CategoriaProducto;

class ActualizarCategoriaProductoAction
{
    public function execute(CategoriaProducto $categoriaProducto, array $data): CategoriaProducto
    {
        $categoriaProducto->update($data);

        return $categoriaProducto;
    }
}
