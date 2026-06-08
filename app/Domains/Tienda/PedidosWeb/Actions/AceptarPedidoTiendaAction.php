<?php

namespace App\Domains\Tienda\PedidosWeb\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Models\PedidoTienda;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AceptarPedidoTiendaAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(PedidoTienda $pedidoTienda): PedidoTienda
    {
        return DB::transaction(function () use ($pedidoTienda) {
            if ($pedidoTienda->estado_pte !== EstadoPedidoTiendaEnum::PENDIENTE_REVISION) {
                throw ValidationException::withMessages([
                    'pedido' => ['Solo se pueden aceptar pedidos pendientes de revisión.'],
                ]);
            }

            $pedidoTienda->update([
                'estado_pte' => EstadoPedidoTiendaEnum::ACEPTADO,
            ]);

            $pedidoTienda->checkoutSesion?->update([
                'estado_che' => EstadoCheckoutSesionEnum::PEDIDO_GENERADO,
            ]);

            $contexto = RegistrarAuditoriaData::fromRequest(request());
            $this->auditoriaService->registrarAccion(
                $contexto, 'Pedidos Web', 'pedidos_tienda',
                (string) $pedidoTienda->cod_pedido_tienda, 'aceptar',
                submodulo: 'Revisión admin',
                accionFuncional: 'Aceptación de pedido tienda',
                descripcion: "Pedido tienda #{$pedidoTienda->cod_pedido_tienda} aceptado por admin.",
                campo: 'estado_pte',
                valorAnterior: EstadoPedidoTiendaEnum::PENDIENTE_REVISION->value,
                valorNuevo: EstadoPedidoTiendaEnum::ACEPTADO->value,
            );

            return $pedidoTienda->fresh();
        });
    }
}
