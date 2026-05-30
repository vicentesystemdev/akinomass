<?php

namespace App\Domains\Tienda\Facturacion\Listeners;

use App\Domains\Comercial\Pagos\Events\PagoConfirmadoEvent;
use App\Domains\Tienda\Facturacion\Actions\EmitirFacturaDesdePedidoAction;
use App\Models\PagoTienda;

class EmitirFacturaTrasConfirmacionListener
{
    public function __construct(
        private EmitirFacturaDesdePedidoAction $emitirFacturaAction,
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

        if ($pedido->estado_ped->value !== 'confirmado') {
            return;
        }

        $this->emitirFacturaAction->execute($pedido);
    }
}
