<?php

namespace App\Domains\Comercial\Pagos\Actions;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Services\PagoService;
use App\Models\Pago;

class ObservarPagoAction
{
    public function __construct(private readonly PagoService $service) {}

    public function execute(Pago $pago): Pago
    {
        return $this->service->cambiarEstado($pago, EstadoPagoEnum::OBSERVADO);
    }
}
