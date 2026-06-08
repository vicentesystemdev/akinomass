<?php

namespace App\Domains\Tienda\PagosWeb\Listeners;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Tienda\PagosWeb\Events\PagoTiendaAceptadoEvent;

class RegistrarAuditoriaPagoAceptadoListener
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function handle(PagoTiendaAceptadoEvent $event): void
    {
        $pago = $event->pago;

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarInsercion(
            $contexto, 'Tienda', 'pagos',
            (string) $pago->cod_pago,
            submodulo: 'Pago aceptado',
            descripcion: "Confirmación de pago tienda #{$pago->cod_pago}. Stock físico descontado definitivamente.",
        );
    }
}
