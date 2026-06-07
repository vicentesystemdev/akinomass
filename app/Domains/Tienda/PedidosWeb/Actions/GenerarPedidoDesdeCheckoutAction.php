<?php

namespace App\Domains\Tienda\PedidosWeb\Actions;

use App\Domains\Comercial\Pedidos\Actions\CrearPedidoAction;
use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\PedidosWeb\DTOs\GenerarPedidoDesdeCheckoutData;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Domains\Tienda\PedidosWeb\Events\PedidoWebGeneradoEvent;
use App\Domains\Tienda\PedidosWeb\Services\PedidoTiendaService;
use App\Models\CheckoutSesion;
use App\Models\CuentaCliente;
use App\Models\Inventario;
use App\Models\PedidoTienda;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GenerarPedidoDesdeCheckoutAction
{
    public function __construct(
        private PedidoTiendaService $service,
        private CrearPedidoAction $crearPedidoAction,
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(int $userId, GenerarPedidoDesdeCheckoutData $data): PedidoTienda
    {
        $checkoutSesion = CheckoutSesion::with(['carrito.detalles', 'cuentaCliente'])
            ->where('cod_checkout_sesion', $data->codCheckoutSesion)
            ->first();

        if (!$checkoutSesion) {
            throw ValidationException::withMessages([
                'checkout' => ['La sesión de checkout no existe.'],
            ]);
        }

        if ($checkoutSesion->estado_che !== EstadoCheckoutSesionEnum::DATOS_COMPLETADOS) {
            throw ValidationException::withMessages([
                'checkout' => ['La sesión de checkout no está en estado datos_completados.'],
            ]);
        }

        $cuentaCliente = CuentaCliente::where('user_id', $userId)->first();

        if (!$cuentaCliente) {
            throw ValidationException::withMessages([
                'usuario' => ['No tiene una cuenta de cliente activa.'],
            ]);
        }

        $carrito = $checkoutSesion->carrito;

        if (!$carrito || $carrito->detalles->isEmpty()) {
            throw ValidationException::withMessages([
                'carrito' => ['El carrito está vacío.'],
            ]);
        }

        foreach ($carrito->detalles as $detalle) {
            $inventario = Inventario::where('cod_producto', $detalle->cod_producto)
                ->where('activo_inv', true)
                ->first();

            if (!$inventario || $inventario->stock_actual_inv < $detalle->cantidad_dca) {
                throw ValidationException::withMessages([
                    'stock' => ['Stock insuficiente para el producto: ' . ($detalle->nombre_producto_dca ?? $detalle->cod_producto)],
                ]);
            }
        }

        $detallesPedido = $this->service->mapearDetallesCarritoParaPedido($carrito->detalles);

        return DB::transaction(function () use ($data, $userId, $cuentaCliente, $checkoutSesion, $carrito, $detallesPedido) {
            $pedido = $this->crearPedidoAction->execute([
                'cod_cliente' => $cuentaCliente->cod_cliente,
                'cod_canal_venta' => $this->service->resolverCanalWeb(),
                'cod_tipo_flujo_comercial' => $this->service->resolverFlujoCompraWeb(),
                'detalles' => $detallesPedido,
            ], null);

            $pedidoTienda = PedidoTienda::create([
                'cod_pedido' => $pedido->cod_pedido,
                'cod_checkout_sesion' => $data->codCheckoutSesion,
                'user_id' => $userId,
                'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
                'session_id_pte' => $data->sessionId,
                'ip_origen_pte' => $data->ipOrigen,
                'user_agent_pte' => $data->userAgent,
                'estado_pte' => EstadoPedidoTiendaEnum::PENDIENTE_REVISION,
            ]);

            $checkoutSesion->update([
                'estado_che' => EstadoCheckoutSesionEnum::PEDIDO_GENERADO,
            ]);

            $carrito->update([
                'estado_car' => EstadoCarritoEnum::CONVERTIDO,
            ]);

            $this->reservaService->convertirReservasAPedido($carrito);

            PedidoWebGeneradoEvent::dispatch($pedidoTienda);

            return $pedidoTienda->load(['pedido', 'checkoutSesion']);
        });
    }
}
