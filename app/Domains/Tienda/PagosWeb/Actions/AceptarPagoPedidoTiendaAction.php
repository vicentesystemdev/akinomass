<?php

namespace App\Domains\Tienda\PagosWeb\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Events\PagoConfirmadoEvent;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\PagosWeb\Events\PagoTiendaAceptadoEvent;
use App\Domains\Tienda\PagosWeb\Events\StockPedidoWebDescontadoEvent;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Models\ComprobantePagoTienda;
use App\Models\Pago;
use App\Models\PagoTienda;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AceptarPagoPedidoTiendaAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
        private DescontarStockDefinitivoPedidoWebAction $descontarStockAction,
    ) {}

    public function execute(Pago $pago): Pago
    {
        return DB::transaction(function () use ($pago) {
            $pagoTienda = PagoTienda::with('checkoutSesion.pedidoTienda', 'checkoutSesion.carrito.detalles')
                ->where('cod_pago', $pago->cod_pago)
                ->lockForUpdate()
                ->first();

            if (!$pagoTienda) {
                throw ValidationException::withMessages([
                    'pago' => ['El pago no pertenece al flujo de tienda.'],
                ]);
            }

            if ($pago->estado_pago_pag === EstadoPagoEnum::PAGADO) {
                throw ValidationException::withMessages([
                    'pago' => ['El pago ya fue aceptado. No se puede aceptar dos veces.'],
                ]);
            }

            $pedidoTienda = $pagoTienda->checkoutSesion->pedidoTienda ?? null;

            if (!$pedidoTienda) {
                throw ValidationException::withMessages([
                    'pedido' => ['No se encontró el pedido de tienda asociado.'],
                ]);
            }

            if (in_array($pedidoTienda->estado_pte, [
                EstadoPedidoTiendaEnum::CONFIRMADO,
                EstadoPedidoTiendaEnum::FACTURADO,
                EstadoPedidoTiendaEnum::CANCELADO,
                EstadoPedidoTiendaEnum::EXPIRADO,
                EstadoPedidoTiendaEnum::RECHAZADO,
            ])) {
                throw ValidationException::withMessages([
                    'pedido' => ['El pedido no está en un estado que permita aceptar el pago.'],
                ]);
            }

            $carrito = $pagoTienda->checkoutSesion->carrito;

            if ($carrito && $carrito->detalles->isNotEmpty()) {
                $this->descontarStockAction->execute($pedidoTienda, $carrito);
            }

            $pago->update(['estado_pago_pag' => EstadoPagoEnum::PAGADO]);

            $pedido = $pago->pedido;
            if ($pedido && $pedido->estado_ped->value === 'borrador') {
                $pedido->update(['estado_ped' => 'confirmado']);
            }

            $pedidoTienda->update([
                'estado_pte' => EstadoPedidoTiendaEnum::CONFIRMADO,
            ]);

            $pagoTienda->checkoutSesion->update([
                'estado_che' => EstadoCheckoutSesionEnum::PAGO_CONFIRMADO,
            ]);

            ComprobantePagoTienda::where('cod_pago_tienda', $pagoTienda->cod_pago_tienda)
                ->where('estado_cpt', 'pendiente')
                ->update([
                    'estado_cpt' => 'aceptado',
                    'revisado_por_user_id' => auth()->id(),
                    'revisado_en_cpt' => now(),
                ]);

            $contexto = RegistrarAuditoriaData::fromRequest(request());
            $this->auditoriaService->registrarAccion(
                $contexto, 'Pagos Web', 'pagos',
                (string) $pago->cod_pago, 'aceptar_pago',
                submodulo: 'Validación admin',
                accionFuncional: 'Aceptación de pago tienda',
                descripcion: "Pago #{$pago->cod_pago} del pedido #{$pedidoTienda->cod_pedido} aceptado. Stock físico descontado.",
                campo: 'estado_pago_pag',
                valorAnterior: $pago->getOriginal('estado_pago_pag')?->value,
                valorNuevo: EstadoPagoEnum::PAGADO->value,
            );

            $pagoFresh = $pago->fresh();
            $pedidoTiendaFresh = $pedidoTienda->fresh();

            event(new StockPedidoWebDescontadoEvent($pedidoTiendaFresh));
            event(new PagoTiendaAceptadoEvent($pagoFresh));
            event(new PagoConfirmadoEvent($pagoFresh));

            return $pagoFresh;
        });
    }
}
