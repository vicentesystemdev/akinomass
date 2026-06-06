<?php

namespace App\Domains\Comercial\Pagos\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Models\Pago;

class RegistrarPagoAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(array $data, ?int $codUsuario): Pago
    {
        $pago = Pago::create([
            'cod_pedido' => $data['cod_pedido'],
            'cod_usuario_responsable' => $codUsuario,
            'metodo_pago_pag' => $data['metodo_pago_pag'],
            'estado_pago_pag' => $data['estado_pago_pag'] ?? EstadoPagoEnum::PENDIENTE,
            'monto_pag' => $data['monto_pag'],
            'referencia_pag' => $data['referencia_pag'] ?? null,
            'fecha_pago_pag' => $data['fecha_pago_pag'] ?? now()->toDateString(),
            'observacion_pag' => $data['observacion_pag'] ?? null,
        ]);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarInsercion(
            $contexto, 'Pagos', 'pagos', (string) $pago->cod_pago,
        );

        return $pago;
    }
}