<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Mensajes\TiendaMensajeService;
use App\Domains\Tienda\PedidosWeb\Actions\GenerarPedidoDesdeCheckoutAction;
use App\Domains\Tienda\PedidosWeb\Actions\ListarPedidosClienteAction;
use App\Domains\Tienda\PedidosWeb\Actions\ObtenerPedidoClienteAction;
use App\Domains\Tienda\PedidosWeb\DTOs\GenerarPedidoDesdeCheckoutData;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\GenerarPedidoRequest;
use App\Models\ComprobantePagoTienda;
use App\Models\Pedido;
use App\Models\PedidoTienda;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PedidoWebController extends Controller
{
    public function index(
        Request $request,
        ListarPedidosClienteAction $action,
        TiendaMensajeService $mensajeService,
        ConfiguracionTiendaService $configService,
    ): Response|JsonResponse
    {
        $pedidos = $action->execute($request->user()->id)
            ->map(fn (PedidoTienda $pedido) => $this->enriquecerPedidoTienda($pedido, $mensajeService, $configService));

        if ($request->expectsJson()) {
            return response()->json(['pedidos' => $pedidos]);
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
        ConfiguracionTiendaService $configService,
    ): Response|JsonResponse {
        $pedidoTienda = $action->execute($request->user()->id, $pedido->cod_pedido);

        if (!$pedidoTienda) {
            abort(404);
        }

        $pedidoEnriquecido = $this->enriquecerPedidoTienda($pedidoTienda, $mensajeService, $configService);
        $pagoTienda = $pedidoTienda->pagoTienda;
        $comprobantes = ComprobantePagoTienda::where('cod_pago_tienda', $pagoTienda?->cod_pago_tienda)
            ->orderBy('subido_en_cpt', 'desc')
            ->get();

        if ($request->expectsJson()) {
            return response()->json([
                'pedidoTienda' => $pedidoEnriquecido,
                'pedido' => $pedidoTienda->pedido,
                'pago' => $pedidoTienda->pago ?? null,
                'pagoTienda' => $pagoTienda,
                'factura' => $pedidoTienda->factura ?? null,
                'mensaje_estado' => $pedidoEnriquecido['mensaje_estado'],
                'puede_resubir_comprobante' => $pedidoEnriquecido['acciones']['puede_resubir_comprobante'],
                'comprobantes' => $comprobantes,
            ]);
        }

        return Inertia::render('Tienda/Cuenta/PedidoShow', [
            'pedidoTienda' => $pedidoEnriquecido,
            'pedido' => $pedidoTienda->pedido,
            'pago' => $pedidoTienda->pago ?? null,
            'pagoTienda' => $pagoTienda,
            'factura' => $pedidoTienda->factura ?? null,
            'mensaje_estado' => $pedidoEnriquecido['mensaje_estado'],
            'puede_resubir_comprobante' => $pedidoEnriquecido['acciones']['puede_resubir_comprobante'],
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

    private function enriquecerPedidoTienda(
        PedidoTienda $pedidoTienda,
        TiendaMensajeService $mensajeService,
        ConfiguracionTiendaService $configService,
    ): array {
        $estado = $pedidoTienda->estado_pte;
        $pagoTienda = $pedidoTienda->pagoTienda;
        $estadoPago = $pedidoTienda->pago?->estado_pago_pag ?? $pagoTienda?->pago?->estado_pago_pag;
        $tienePagoTienda = (bool) $pagoTienda;

        $puedeContinuarPago = ! $tienePagoTienda && in_array($estado, [
            EstadoPedidoTiendaEnum::PENDIENTE_REVISION,
            EstadoPedidoTiendaEnum::PENDIENTE_PAGO,
            EstadoPedidoTiendaEnum::ACEPTADO,
        ], true);

        $puedeResubir = $tienePagoTienda && $mensajeService->puedeResubirComprobante($estado, $estadoPago);

        $pedidoArray = $pedidoTienda->toArray();
        $pedidoArray['mensaje_estado'] = $mensajeService->obtenerMensajePedido($estado);
        $pedidoArray['acciones'] = [
            'puede_continuar_pago' => $puedeContinuarPago,
            'puede_resubir_comprobante' => $puedeResubir,
            'url_checkout' => $pedidoTienda->checkoutSesion?->token_che
                ? route('tienda.checkout.show', $pedidoTienda->checkoutSesion->token_che)
                : null,
            'url_resubir' => $pagoTienda
                ? route('tienda.pago.resubir', $pagoTienda->cod_pago_tienda)
                : null,
        ];
        $pedidoArray['tiempo_pago'] = $this->construirTiempoPago($pedidoTienda, $mensajeService, $configService);

        return $pedidoArray;
    }

    private function construirTiempoPago(
        PedidoTienda $pedidoTienda,
        TiendaMensajeService $mensajeService,
        ConfiguracionTiendaService $configService,
    ): ?array {
        $estado = $pedidoTienda->estado_pte;
        $base = null;
        $ttlMinutos = null;
        $mensaje = null;

        if (! $pedidoTienda->pagoTienda && in_array($estado, [
            EstadoPedidoTiendaEnum::PENDIENTE_REVISION,
            EstadoPedidoTiendaEnum::PENDIENTE_PAGO,
            EstadoPedidoTiendaEnum::ACEPTADO,
        ], true)) {
            $base = $pedidoTienda->created_at;
            $ttlMinutos = $configService->obtenerTiempoPagoPendienteMinutos();
            $mensaje = 'Tiempo para subir el comprobante de pago.';
        } elseif ($estado === EstadoPedidoTiendaEnum::PAGO_OBSERVADO) {
            $base = $pedidoTienda->updated_at;
            $ttlMinutos = $configService->obtenerTiempoCorreccionPagoMinutos();
            $mensaje = 'Tiempo para corregir el comprobante observado.';
        } elseif ($estado === EstadoPedidoTiendaEnum::PAGO_RECHAZADO) {
            $base = $pedidoTienda->updated_at;
            $ttlMinutos = $configService->obtenerTiempoResubidaPagoRechazadoMinutos();
            $mensaje = 'Tiempo para resubir el comprobante rechazado.';
        }

        if (! $base || ! $ttlMinutos) {
            return null;
        }

        $expiraEn = $base->copy()->addMinutes($ttlMinutos);
        $segundos = $mensajeService->obtenerTiempoRestanteSegundos($expiraEn);

        return [
            'expira_en' => $expiraEn,
            'tiempo_restante_segundos' => $segundos,
            'tiempo_restante_formateado' => $mensajeService->formatearTiempoRestante($segundos),
            'ttl_minutos' => $ttlMinutos,
            'mensaje' => $mensaje,
            'expirado' => $segundos <= 0,
        ];
    }
}
