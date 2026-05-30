<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Models\CheckoutSesion;

class CalcularTotalesCheckoutAction
{
    public function execute(CheckoutSesion $checkoutSesion): CheckoutSesion
    {
        if (!$checkoutSesion->carrito) {
            return $checkoutSesion;
        }

        $checkoutSesion->carrito->load('detalles');

        $subtotal = $checkoutSesion->carrito->detalles->sum('subtotal_dca');

        $checkoutSesion->update([
            'subtotal_che' => $subtotal,
            'descuento_che' => 0,
            'impuesto_che' => 0,
            'total_che' => $subtotal,
        ]);

        return $checkoutSesion->fresh();
    }
}
