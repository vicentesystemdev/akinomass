<?php

namespace App\Domains\Tienda\Facturacion\Listeners;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Comercial\Pagos\Events\PagoConfirmadoEvent;
use App\Domains\Tienda\Facturacion\Actions\EmitirFacturaDesdePedidoAction;
use App\Models\PagoTienda;

class EmitirFacturaTrasConfirmacionListener
{
    public function __construct(
        private EmitirFacturaDesdePedidoAction $emitirFacturaAction,
        private RegistrarAuditoriaService $auditoriaService,
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

        $factura = $this->emitirFacturaAction->execute($pedido);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarInsercion(
            $contexto, 'Facturación', 'facturas', (string) $factura->cod_factura,
            submodulo: 'Emisión automática',
            descripcion: "Se emitió la factura {$factura->numero_factura_fac} para el pedido #{$pedido->cod_pedido}.",
        );
    }
}
