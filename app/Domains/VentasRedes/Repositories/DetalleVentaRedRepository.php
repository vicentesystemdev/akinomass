<?php

namespace App\Domains\VentasRedes\Repositories;

use App\Models\VentaRed;

class DetalleVentaRedRepository
{
    public function listarPorVenta(VentaRed $ventaRed)
    {
        return $ventaRed->detalles()->with(['producto', 'variante.talla', 'talla'])->get();
    }
}
