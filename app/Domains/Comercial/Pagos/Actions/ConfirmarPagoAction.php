<?php

namespace App\Domains\Comercial\Pagos\Actions;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Events\PagoConfirmadoEvent;
use App\Domains\Comercial\Pagos\Services\PagoService;
use App\Models\Pago;

class ConfirmarPagoAction
{
    public function __construct(private readonly PagoService $service) {}

    public function execute(Pago $pago): Pago
    {
        $pago = $this->service->cambiarEstado($pago, EstadoPagoEnum::PAGADO);

        PagoConfirmadoEvent::dispatch($pago);

        return $pago;
    }
}
