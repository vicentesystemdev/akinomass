<?php

namespace App\Domains\Comercial\Pagos\Services;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Models\Pago;
use RuntimeException;

class PagoService
{
    public function validarEdicion(Pago $pago): void
    {
        if (! in_array($pago->estado_pago_pag, [EstadoPagoEnum::PENDIENTE, EstadoPagoEnum::OBSERVADO], true)) {
            throw new RuntimeException('Solo se puede editar un pago pendiente u observado.');
        }
    }

    public function cambiarEstado(Pago $pago, EstadoPagoEnum $nuevoEstado): Pago
    {
        if ($pago->estado_pago_pag === EstadoPagoEnum::PAGADO && $nuevoEstado !== EstadoPagoEnum::REEMBOLSADO) {
            throw new RuntimeException('Un pago ya pagado no puede cambiar a ese estado.');
        }

        $pago->update(['estado_pago_pag' => $nuevoEstado]);

        return $pago->refresh();
    }
}
