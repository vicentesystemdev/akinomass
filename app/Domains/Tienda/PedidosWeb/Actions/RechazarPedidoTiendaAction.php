<?php

namespace App\Domains\Tienda\PedidosWeb\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Models\PedidoTienda;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RechazarPedidoTiendaAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(PedidoTienda $pedidoTienda, string $motivo): PedidoTienda
    {
        return DB::transaction(function () use ($pedidoTienda, $motivo) {
            if ($pedidoTienda->estado_pte !== EstadoPedidoTiendaEnum::PENDIENTE_REVISION) {
                throw ValidationException::withMessages([
                    'pedido' => ['Solo se pueden rechazar pedidos pendientes de revisión.'],
                ]);
            }

            if (empty(trim($motivo))) {
                throw ValidationException::withMessages([
                    'motivo' => ['El motivo de rechazo es obligatorio.'],
                ]);
            }

            $pedidoTienda->update([
                'estado_pte' => EstadoPedidoTiendaEnum::RECHAZADO,
            ]);

            if ($pedidoTienda->checkoutSesion) {
                $pedidoTienda->checkoutSesion->update([
                    'estado_che' => EstadoCheckoutSesionEnum::CANCELADO,
                ]);

                if ($pedidoTienda->checkoutSesion->cod_carrito && $pedidoTienda->checkoutSesion->carrito) {
                    $this->reservaService->liberarReservasPorCarrito($pedidoTienda->checkoutSesion->carrito);
                }
            }

            if ($pedidoTienda->pago) {
                $pedidoTienda->pago->update([
                    'estado_pago_pag' => 'anulado',
                ]);
            }

            $contexto = RegistrarAuditoriaData::fromRequest(request());
            $this->auditoriaService->registrarAccion(
                $contexto, 'Pedidos Web', 'pedidos_tienda',
                (string) $pedidoTienda->cod_pedido_tienda, 'rechazar',
                submodulo: 'Revisión admin',
                accionFuncional: 'Rechazo de pedido tienda',
                descripcion: "Pedido tienda #{$pedidoTienda->cod_pedido_tienda} rechazado. Motivo: {$motivo}",
                campo: 'estado_pte',
                valorAnterior: EstadoPedidoTiendaEnum::PENDIENTE_REVISION->value,
                valorNuevo: EstadoPedidoTiendaEnum::RECHAZADO->value,
            );

            return $pedidoTienda->fresh();
        });
    }
}
