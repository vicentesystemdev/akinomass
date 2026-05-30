<?php

namespace App\Domains\Tienda\PedidosWeb\Listeners;

use App\Domains\Tienda\PedidosWeb\Events\PedidoWebGeneradoEvent;

class ActualizarCheckoutTrasPedidoListener
{
    public function handle(PedidoWebGeneradoEvent $event): void
    {
        $pedidoTienda = $event->pedidoTienda;

        if ($pedidoTienda->checkoutSesion) {
            $pedidoTienda->checkoutSesion->update([
                'estado_che' => 'pedido_generado',
            ]);
        }
    }
}
