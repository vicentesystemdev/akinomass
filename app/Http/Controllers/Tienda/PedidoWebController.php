<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Mensajes\TiendaMensajeService;
use App\Domains\Tienda\PedidosWeb\Actions\GenerarPedidoDesdeCheckoutAction;
use App\Domains\Tienda\PedidosWeb\Actions\ListarPedidosClienteAction;
use App\Domains\Tienda\PedidosWeb\Actions\ObtenerPedidoClienteAction;
use App\Domains\Tienda\PedidosWeb\DTOs\GenerarPedidoDesdeCheckoutData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\GenerarPedidoRequest;
use App\Models\ComprobantePagoTienda;
use App\Models\Pedido;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PedidoWebController extends Controller
{
    public function index(Request $request, ListarPedidosClienteAction $action, TiendaMensajeService $mensajeService): Response|JsonResponse
    {
        $pedidos = $action->execute($request->user()->id);

        if ($request->expectsJson()) {
            $pedidosEnriquecidos = $pedidos->map(function ($pedido) use ($mensajeService) {
                $pedidoArray = is_array($pedido) ? $pedido : $pedido->toArray();
                $estadoPt = $pedido->estado_pte ?? $pedidoArray['estado_pte'] ?? null;
                if ($estadoPt) {
                    $pedidoArray['mensaje_estado'] = $mensajeService->obtenerMensajePedido($estadoPt);
                    $pedidoArray['puede_resubir_comprobante'] = $mensajeService->puedeResubirComprobante(
                        $estadoPt,
                        $pedido->pago?->estado_pago_pag ?? $pedidoArray['pago']['estado_pago_pag'] ?? null
                    );
                }
                return $pedidoArray;
            });

            return response()->json(['pedidos' => $pedidosEnriquecidos]);
        }

        return Inertia::render('Tienda/Cuenta/Pedidos', [
            'pedidos' => $pedidos,
        ]);
    }

    public function show(
        Pedido $pedido,
        ObtenerPedidoClienteAction $action,
        Request $request,
        TiendaMensajeService $mensajeService,
    ): Response|JsonResponse {
        $pedidoTienda = $action->execute($request->user()->id, $pedido->cod_pedido);

        if (!$pedidoTienda) {
            abort(404);
        }

        $mensajeEstado = $mensajeService->obtenerMensajePedido($pedidoTienda->estado_pte);
        $puedeResubir = $mensajeService->puedeResubirComprobante(
            $pedidoTienda->estado_pte,
            $pedidoTienda->pago?->estado_pago_pag
        );

        $comprobantes = ComprobantePagoTienda::where('cod_pago_tienda', $pedidoTienda->pago?->cod_pago_tienda)
            ->orderBy('subido_en_cpt', 'desc')
            ->get();

        if ($request->expectsJson()) {
            return response()->json([
                'pedidoTienda' => $pedidoTienda,
                'pedido' => $pedidoTienda->pedido,
                'pago' => $pedidoTienda->pago ?? null,
                'factura' => $pedidoTienda->factura ?? null,
                'mensaje_estado' => $mensajeEstado,
                'puede_resubir_comprobante' => $puedeResubir,
                'comprobantes' => $comprobantes,
            ]);
        }

        return Inertia::render('Tienda/Cuenta/PedidoShow', [
            'pedidoTienda' => $pedidoTienda,
            'pedido' => $pedidoTienda->pedido,
            'pago' => $pedidoTienda->pago ?? null,
            'factura' => $pedidoTienda->factura ?? null,
            'mensaje_estado' => $mensajeEstado,
            'puede_resubir_comprobante' => $puedeResubir,
            'comprobantes' => $comprobantes,
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
