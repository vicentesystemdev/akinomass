<?php

namespace App\Domains\Comercial\Pagos\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Events\PagoConfirmadoEvent;
use App\Domains\Comercial\Pagos\Services\PagoService;
use App\Models\Pago;
use Illuminate\Support\Str;

class ConfirmarPagoAction
{
    public function __construct(private readonly PagoService $service, private RegistrarAuditoriaService $auditoriaService) {}

    public function execute(Pago $pago): Pago
    {
        $estadoAnterior = $pago->estado_pago_pag;
        $pago = $this->service->cambiarEstado($pago, EstadoPagoEnum::PAGADO);
        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $idEvento = (string) Str::uuid();

        $this->auditoriaService->registrarAccion(
            $contexto, 'Pagos', 'pagos', (string) $pago->cod_pago, 'cambio_estado',
            submodulo: 'Confirmación', idEvento: $idEvento,
            accionFuncional: 'Confirmación de pago',
            descripcion: "El pago #{$pago->cod_pago} del pedido #{$pago->cod_pedido} fue confirmado.",
            campo: 'estado_pago_pag',
            valorAnterior: $estadoAnterior instanceof \BackedEnum ? $estadoAnterior->value : (string) $estadoAnterior,
            valorNuevo: EstadoPagoEnum::PAGADO->value,
        );

        PagoConfirmadoEvent::dispatch($pago);
        return $pago;
    }
}
