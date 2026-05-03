<?php

namespace App\Domains\Comercial\Pagos\Actions;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Models\Pago;

class RegistrarPagoAction
{
    public function execute(array $data, ?int $codUsuario): Pago
    {
        return Pago::create([
            'cod_pedido' => $data['cod_pedido'],
            'cod_usuario_responsable' => $codUsuario,
            'metodo_pago_pag' => $data['metodo_pago_pag'],
            'estado_pago_pag' => $data['estado_pago_pag'] ?? EstadoPagoEnum::PENDIENTE,
            'monto_pag' => $data['monto_pag'],
            'referencia_pag' => $data['referencia_pag'] ?? null,
            'fecha_pago_pag' => $data['fecha_pago_pag'] ?? now()->toDateString(),
            'observacion_pag' => $data['observacion_pag'] ?? null,
        ]);
    }
}
