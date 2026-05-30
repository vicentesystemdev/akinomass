<?php

namespace App\Domains\Tienda\Carrito\Services;

use App\Models\Carrito;

class CarritoCalculoService
{
    public function recalcularSubtotales(Carrito $carrito): void
    {
        $carrito->load('detalles');

        $subtotal = $carrito->detalles->sum('subtotal_dca');

        $carrito->update([
            'subtotal_car' => $subtotal,
            'total_car' => $subtotal,
        ]);
    }
}
