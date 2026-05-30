<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\PedidosWeb\Actions\GenerarPedidoDesdeCheckoutAction;
use App\Domains\Tienda\PedidosWeb\Actions\ListarPedidosClienteAction;
use App\Domains\Tienda\PedidosWeb\Actions\ObtenerPedidoClienteAction;
use App\Domains\Tienda\PedidosWeb\DTOs\GenerarPedidoDesdeCheckoutData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\GenerarPedidoRequest;
use App\Models\Pedido;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PedidoWebController extends Controller
{
    public function index(Request $request, ListarPedidosClienteAction $action): Response|JsonResponse
    {
        $pedidos = $action->execute($request->user()->id);

        if ($request->expectsJson()) {
            return response()->json(['pedidos' => $pedidos]);
        }

        return Inertia::render('Tienda/Cuenta/Pedidos', [
            'pedidos' => $pedidos,
        ]);
    }

    public function show(Pedido $pedido, ObtenerPedidoClienteAction $action, Request $request): Response|JsonResponse
    {
        $pedidoTienda = $action->execute($request->user()->id, $pedido->cod_pedido);

        if (!$pedidoTienda) {
            abort(404);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'pedidoTienda' => $pedidoTienda,
                'pedido' => $pedidoTienda->pedido,
                'pago' => $pedidoTienda->pago ?? null,
                'factura' => $pedidoTienda->factura ?? null,
            ]);
        }

        return Inertia::render('Tienda/Cuenta/PedidoShow', [
            'pedidoTienda' => $pedidoTienda,
            'pedido' => $pedidoTienda->pedido,
            'pago' => $pedidoTienda->pago ?? null,
            'factura' => $pedidoTienda->factura ?? null,
        ]);
    }

    public function generar(
        Request $request,
        GenerarPedidoRequest $formRequest,
        GenerarPedidoDesdeCheckoutAction $action,
    ): RedirectResponse|JsonResponse {
        $data = GenerarPedidoDesdeCheckoutData::fromArray([
            ...$formRequest->validated(),
            'session_id' => $request->session()->getId(),
            'ip_origen' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $pedidoTienda = $action->execute($request->user()->id, $data);

        if ($request->expectsJson()) {
            return response()->json([
                'mensaje' => 'Pedido generado correctamente.',
                'pedido' => $pedidoTienda->load('pedido'),
            ]);
        }

        return redirect()
            ->route('tienda.checkout.show', $pedidoTienda->checkoutSesion->token_che)
            ->with('success', 'Pedido generado correctamente.');
    }
}
