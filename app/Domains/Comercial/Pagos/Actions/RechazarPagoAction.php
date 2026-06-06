<?php

namespace App\Domains\Comercial\Pagos\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Services\PagoService;
use App\Models\Pago;

class RechazarPagoAction
{
    public function __construct(private readonly PagoService $service, private RegistrarAuditoriaService $auditoriaService) {}

    public function execute(Pago $pago): Pago
    {
        $estadoAnterior = $pago->estado_pago_pag;
        $pago = $this->service->cambiarEstado($pago, EstadoPagoEnum::RECHAZADO);
        $contexto = RegistrarAuditoriaData::fromRequest(request());

        $this->auditoriaService->registrarAccion(
            $contexto, 'Pagos', 'pagos', (string) $pago->cod_pago, 'cambio_estado',
            submodulo: 'Rechazo',
            accionFuncional: 'Rechazo de pago',
            descripcion: "El pago #{$pago->cod_pago} del pedido #{$pago->cod_pedido} fue rechazado.",
            campo: 'estado_pago_pag',
            valorAnterior: $estadoAnterior instanceof \BackedEnum ? $estadoAnterior->value : (string) $estadoAnterior,
            valorNuevo: EstadoPagoEnum::RECHAZADO->value,
        );

        return $pago;
    }
}
