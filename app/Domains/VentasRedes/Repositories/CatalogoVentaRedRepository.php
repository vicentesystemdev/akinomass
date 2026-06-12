<?php

namespace App\Domains\VentasRedes\Repositories;

use App\Models\Producto;

class CatalogoVentaRedRepository
{
    public function productosActivos()
    {
        return Producto::with(['variantes.talla', 'inventarios'])
            ->where('estado_pro', 'activo')
            ->orderBy('nombre_pro')
            ->get();
    }
}
