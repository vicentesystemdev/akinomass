<?php

namespace App\Domains\Tienda\PagosWeb\Listeners;

use App\Domains\Comercial\Pagos\Events\PagoConfirmadoEvent;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Models\PagoTienda;

class ActualizarEstadoTrasPagoConfirmadoListener
{
    public function handle(PagoConfirmadoEvent $event): void
    {
        $pago = $event->pago;

        $pagoTienda = PagoTienda::with('checkoutSesion.pedidoTienda')
            ->where('cod_pago', $pago->cod_pago)
            ->first();

        if (!$pagoTienda) {
            return;
        }

        $pedidoTienda = $pagoTienda->checkoutSesion->pedidoTienda ?? null;

        if ($pedidoTienda) {
            $pedidoTienda->update([
                'estado_pte' => EstadoPedidoTiendaEnum::PAGADO,
            ]);
        }

        $pagoTienda->checkoutSesion->update([
            'estado_che' => EstadoCheckoutSesionEnum::PAGO_CONFIRMADO,
        ]);
    }
}
