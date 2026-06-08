<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\PagosWeb\Actions\AceptarPagoPedidoTiendaAction;
use App\Domains\Tienda\PagosWeb\Actions\ObservarPagoPedidoTiendaAction;
use App\Domains\Tienda\PagosWeb\Actions\RechazarPagoPedidoTiendaAction;
use App\Domains\Tienda\PagosWeb\Services\PagoTiendaService;
use App\Http\Controllers\Controller;
use App\Models\ComprobantePagoTienda;
use App\Models\Pago;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPagoTiendaController extends Controller
{
    public function show(
        Request $request,
        Pago $pago,
        PagoTiendaService $pagoService,
    ): Response|JsonResponse {
        $this->authorize('pagos_tienda.revisar');

        $pagoTienda = $pagoService->obtenerPorCodPago($pago->cod_pago);

        if (!$pagoTienda) {
            abort(404);
        }

        $comprobantes = ComprobantePagoTienda::where('cod_pago_tienda', $pagoTienda->cod_pago_tienda)
            ->with(['subidoPor', 'revisadoPor'])
            ->orderBy('subido_en_cpt', 'desc')
            ->get()
            ->map(function ($comprobante) {
                return [
                    'intento' => $comprobante->intentos_cpt ?? 1,
                    'fecha_subida' => $comprobante->subido_en_cpt,
                    'archivo' => $comprobante->ruta_comprobante_cpt,
                    'hash' => $comprobante->hash_comprobante_cpt,
                    'mime' => $comprobante->mime_cpt,
                    'tamano_bytes' => $comprobante->tamano_bytes_cpt,
                    'estado' => $comprobante->estado_cpt,
                    'observacion' => $comprobante->observacion_admin_cpt,
                    'subido_por' => $comprobante->subidoPor?->name,
                    'revisado_por' => $comprobante->revisadoPor?->name,
                    'fecha_revision' => $comprobante->revisado_en_cpt,
                ];
            });

        if ($request->expectsJson()) {
            return response()->json([
                'pagoTienda' => $pagoTienda,
                'pago' => $pagoTienda->pago,
                'pedidoTienda' => $pagoTienda->checkoutSesion->pedidoTienda ?? null,
                'comprobantes' => $comprobantes,
            ]);
        }

        return Inertia::render('Admin/Tienda/PagoShow', [
            'pagoTienda' => $pagoTienda,
            'pago' => $pagoTienda->pago,
            'pedidoTienda' => $pagoTienda->checkoutSesion->pedidoTienda ?? null,
            'comprobantes' => $comprobantes,
        ]);
    }

    public function aceptar(
        Request $request,
        Pago $pago,
        AceptarPagoPedidoTiendaAction $action,
    ): RedirectResponse|JsonResponse {
        $this->authorize('pagos_tienda.aceptar');

        $action->execute($pago);

        if ($request->expectsJson()) {
            return response()->json(['success' => 'Pago aceptado. Stock descontado y pedido confirmado.']);
        }

        return redirect()->back()->with('success', 'Pago aceptado. Stock descontado y pedido confirmado.');
    }

    public function observar(
        Request $request,
        Pago $pago,
        ObservarPagoPedidoTiendaAction $action,
    ): RedirectResponse|JsonResponse {
        $this->authorize('pagos_tienda.observar');

        $motivo = $request->input('motivo', '');
        $action->execute($pago, $motivo);

        if ($request->expectsJson()) {
            return response()->json(['success' => 'Pago observado. El cliente puede resubir comprobante.']);
        }

        return redirect()->back()->with('success', 'Pago observado. El cliente puede resubir comprobante.');
    }

    public function rechazar(
        Request $request,
        Pago $pago,
        RechazarPagoPedidoTiendaAction $action,
    ): RedirectResponse|JsonResponse {
        $this->authorize('pagos_tienda.rechazar');

        $motivo = $request->input('motivo', '');
        $action->execute($pago, $motivo);

        if ($request->expectsJson()) {
            return response()->json(['success' => 'Pago rechazado. El cliente puede resubir comprobante.']);
        }

        return redirect()->back()->with('success', 'Pago rechazado. El cliente puede resubir comprobante.');
    }
}
