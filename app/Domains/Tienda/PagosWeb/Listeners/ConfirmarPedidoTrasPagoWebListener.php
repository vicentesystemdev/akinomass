<?php

namespace App\Domains\Tienda\PagosWeb\Listeners;

use App\Domains\Comercial\Pagos\Events\PagoConfirmadoEvent;
use App\Domains\Comercial\Pedidos\Actions\ConfirmarPedidoAction;
use App\Models\PagoTienda;

class ConfirmarPedidoTrasPagoWebListener
{
    public function __construct(
        private ConfirmarPedidoAction $confirmarPedidoAction,
    ) {}

    public function handle(PagoConfirmadoEvent $event): void
    {
        $pago = $event->pago;

        if (!PagoTienda::where('cod_pago', $pago->cod_pago)->exists()) {
            return;
        }

        $pedido = $pago->pedido;

        if (!$pedido) {
            return;
        }

        if ($pedido->estado_ped->value === 'borrador') {
            $this->confirmarPedidoAction->execute($pedido, null);
        }
    }
}
