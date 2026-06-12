<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Mensajes\TiendaMensajeService;
use App\Domains\Tienda\PagosWeb\Actions\ObtenerPagoClienteAction;
use App\Domains\Tienda\PagosWeb\Actions\RegistrarPagoDesdeCheckoutAction;
use App\Domains\Tienda\PagosWeb\Actions\ResubirComprobantePagoTiendaAction;
use App\Domains\Tienda\PagosWeb\DTOs\RegistrarPagoDesdeCheckoutData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\RegistrarPagoCheckoutRequest;
use App\Models\ComprobantePagoTienda;
use App\Models\PagoTienda;
use App\Models\Pedido;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PagoWebController extends Controller
{
    public function registrar(
        Request $request,
        string $token,
        RegistrarPagoCheckoutRequest $formRequest,
        RegistrarPagoDesdeCheckoutAction $action,
    ): RedirectResponse|JsonResponse {
        $data = RegistrarPagoDesdeCheckoutData::fromArray($formRequest->validated());

        $pagoTienda = $action->execute(
            $request->user()->id,
            $data,
            $request->file('comprobante')
        );

        if ($request->expectsJson()) {
            return response()->json([
                'mensaje' => 'Pago registrado exitosamente.',
                'pago' => $pagoTienda->load('pago'),
            ]);
        }

        return redirect()
            ->route('tienda.checkout.show', $token)
            ->with('success', 'Pago registrado exitosamente.');
    }

    public function show(
        Pedido $pedido,
        ObtenerPagoClienteAction $action,
        Request $request,
        TiendaMensajeService $mensajeService,
    ): RedirectResponse|JsonResponse {
        $pagoTienda = $action->execute($request->user()->id, $pedido->cod_pedido);

        if (!$pagoTienda) {
            abort(404);
        }

        $comprobantes = ComprobantePagoTienda::where('cod_pago_tienda', $pagoTienda->cod_pago_tienda)
            ->orderBy('subido_en_cpt', 'desc')
            ->get();

        $pedidoTienda = $pagoTienda->checkoutSesion->pedidoTienda ?? null;

        if ($request->expectsJson()) {
            return response()->json([
                'pago' => $pagoTienda,
                'pedido' => $pedido,
                'comprobantes' => $comprobantes,
                'mensaje_estado' => $pedidoTienda
                    ? $mensajeService->obtenerMensajePedido($pedidoTienda->estado_pte)
                    : null,
                'puede_resubir_comprobante' => $pedidoTienda
                    ? $mensajeService->puedeResubirComprobante(
                        $pedidoTienda->estado_pte,
                        $pagoTienda->pago->estado_pago_pag
                    )
                    : false,
            ]);
        }

        return redirect()->route('tienda.cuenta.pedido.show', $pedido->cod_pedido);
    }

    public function resubir(
        Request $request,
        PagoTienda $pagoTienda,
        ResubirComprobantePagoTiendaAction $action,
    ): RedirectResponse|JsonResponse {
        if ((int) $pagoTienda->user_id !== (int) $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'comprobante' => ['required', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf'],
        ]);

        $comprobante = $action->execute(
            $request->user()->id,
            $pagoTienda,
            $request->file('comprobante'),
        );

        if ($request->expectsJson()) {
            return response()->json([
                'mensaje' => 'Comprobante resubido. Pendiente de revisión.',
                'comprobante' => $comprobante,
            ]);
        }

        return redirect()->back()->with('success', 'Comprobante resubido exitosamente. Tu pago será revisado nuevamente.');
    }
}
