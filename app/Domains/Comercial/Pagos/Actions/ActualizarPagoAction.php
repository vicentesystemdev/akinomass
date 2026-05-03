<?php

namespace App\Domains\Comercial\Pagos\Actions;

use App\Domains\Comercial\Pagos\Services\PagoService;
use App\Models\Pago;

class ActualizarPagoAction
{
    public function __construct(private readonly PagoService $service) {}

    public function execute(Pago $pago, array $data): Pago
    {
        $this->service->validarEdicion($pago);

        $pago->update([
            'metodo_pago_pag' => $data['metodo_pago_pag'],
            'monto_pag' => $data['monto_pag'],
            'referencia_pag' => $data['referencia_pag'] ?? null,
            'fecha_pago_pag' => $data['fecha_pago_pag'] ?? $pago->fecha_pago_pag?->toDateString(),
            'observacion_pag' => $data['observacion_pag'] ?? null,
        ]);

        return $pago->refresh();
    }
}
