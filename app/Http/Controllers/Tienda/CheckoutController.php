<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Checkout\Actions\ActualizarCheckoutTrasCambioCarritoAction;
use App\Domains\Tienda\Checkout\Actions\ActualizarDatosCheckoutAction;
use App\Domains\Tienda\Checkout\Actions\CancelarCheckoutAction;
use App\Domains\Tienda\Checkout\Actions\CancelarCheckoutLiberandoReservasAction;
use App\Domains\Tienda\Checkout\Actions\ExtenderReservasAlIniciarCheckoutAction;
use App\Domains\Tienda\Checkout\Actions\IniciarCheckoutAction;
use App\Domains\Tienda\Checkout\Actions\VolverAlCarritoDesdeCheckoutAction;
use App\Domains\Tienda\Checkout\DTOs\ActualizarDatosCheckoutData;
use App\Domains\Tienda\Checkout\DTOs\IniciarCheckoutData;
use App\Domains\Tienda\Checkout\Services\CheckoutService;
use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;
use App\Domains\Tienda\Mensajes\TiendaMensajeService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\ActualizarDatosCheckoutRequest;
use App\Http\Requests\Tienda\IniciarCheckoutRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function iniciar(
        Request $request,
        IniciarCheckoutRequest $formRequest,
        IniciarCheckoutAction $action,
        ConfiguracionTiendaService $configService,
        TiendaMensajeService $mensajeService,
    ): RedirectResponse|JsonResponse {
        $data = IniciarCheckoutData::fromArray($formRequest->validated());

        $checkoutSesion = $action->execute($request->user()->id, $data);

        if ($request->expectsJson()) {
            $checkoutData = $this->enriquecerCheckoutResponse(
                $checkoutSesion,
                $configService,
                $mensajeService,
            );

            return response()->json([
                'mensaje' => 'Checkout iniciado.',
                'checkout' => $checkoutData,
                'token' => $checkoutSesion->token_che,
            ]);
        }

        return redirect()->route('tienda.checkout.show', $checkoutSesion->token_che);
    }

    public function show(
        string $token,
        CheckoutService $service,
        Request $request,
        ConfiguracionTiendaService $configService,
        TiendaMensajeService $mensajeService,
    ): Response|JsonResponse {
        $checkoutSesion = $service->resolverPorToken($token);

        if (!$checkoutSesion) {
            abort(404);
        }

        if (!$service->verificarPertenencia($checkoutSesion, $request->user()->id)) {
            abort(403);
        }

        if ($request->expectsJson()) {
            $checkoutData = $this->enriquecerCheckoutResponse(
                $checkoutSesion,
                $configService,
                $mensajeService,
            );

            return response()->json(['checkout' => $checkoutData]);
        }

        $pedidoTienda = $checkoutSesion->pedidoTienda?->load('pedido');
        $checkoutData = $this->enriquecerCheckoutResponse(
            $checkoutSesion,
            $configService,
            $mensajeService,
        );

        return Inertia::render('Tienda/Checkout/Index', [
            'checkout' => $checkoutData,
            'pedido' => $pedidoTienda,
        ]);
    }

    public function actualizarDatos(
        Request $request,
        string $token,
        ActualizarDatosCheckoutRequest $formRequest,
        ActualizarDatosCheckoutAction $action,
        CheckoutService $service,
        ConfiguracionTiendaService $configService,
        TiendaMensajeService $mensajeService,
    ): RedirectResponse|JsonResponse {
        $checkoutSesion = $service->resolverPorToken($token);

        if (!$checkoutSesion) {
            abort(404);
        }

        if (!$service->verificarPertenencia($checkoutSesion, $request->user()->id)) {
            abort(403);
        }

        $data = ActualizarDatosCheckoutData::fromArray($formRequest->validated());

        $checkoutSesion = $action->execute($checkoutSesion, $data);

        if ($request->expectsJson()) {
            $checkoutData = $this->enriquecerCheckoutResponse(
                $checkoutSesion,
                $configService,
                $mensajeService,
            );

            return response()->json([
                'mensaje' => 'Datos actualizados.',
                'checkout' => $checkoutData,
            ]);
        }

        return redirect()->back()->with('success', 'Datos actualizados.');
    }

    public function cancelar(
        Request $request,
        string $token,
        CancelarCheckoutAction $action,
        CheckoutService $service,
    ): RedirectResponse|JsonResponse {
        $checkoutSesion = $service->resolverPorToken($token);

        if (!$checkoutSesion) {
            abort(404);
        }

        if (!$service->verificarPertenencia($checkoutSesion, $request->user()->id)) {
            abort(403);
        }

        $action->execute($checkoutSesion);

        if ($request->expectsJson()) {
            return response()->json(['mensaje' => 'Checkout cancelado.']);
        }

        return redirect()->route('tienda.carrito')->with('success', 'Checkout cancelado.');
    }

    public function volverAlCarrito(
        Request $request,
        string $token,
        VolverAlCarritoDesdeCheckoutAction $action,
        CheckoutService $service,
        ConfiguracionTiendaService $configService,
        TiendaMensajeService $mensajeService,
    ): RedirectResponse|JsonResponse {
        $checkoutSesion = $service->resolverPorToken($token);

        if (!$checkoutSesion) {
            abort(404);
        }

        if (!$service->verificarPertenencia($checkoutSesion, $request->user()->id)) {
            abort(403);
        }

        $action->execute($checkoutSesion);

        if ($request->expectsJson()) {
            $checkoutData = $this->enriquecerCheckoutResponse(
                $checkoutSesion->fresh(),
                $configService,
                $mensajeService,
            );

            return response()->json([
                'mensaje' => 'Has vuelto al carrito. Tus productos siguen reservados.',
                'checkout' => $checkoutData,
            ]);
        }

        return redirect()->route('tienda.carrito')
            ->with('success', 'Has vuelto al carrito. Puedes seguir editando tu pedido.');
    }

    public function cancelarCompra(
        Request $request,
        string $token,
        CancelarCheckoutLiberandoReservasAction $action,
        CheckoutService $service,
    ): RedirectResponse|JsonResponse {
        $checkoutSesion = $service->resolverPorToken($token);

        if (!$checkoutSesion) {
            abort(404);
        }

        if (!$service->verificarPertenencia($checkoutSesion, $request->user()->id)) {
            abort(403);
        }

        $action->execute($checkoutSesion);

        if ($request->expectsJson()) {
            return response()->json(['mensaje' => 'Compra cancelada y reservas liberadas.']);
        }

        return redirect()->route('tienda.catalogo')
            ->with('success', 'Tu compra ha sido cancelada y los productos han sido liberados.');
    }

    public function extenderReservas(
        Request $request,
        string $token,
        ExtenderReservasAlIniciarCheckoutAction $action,
        CheckoutService $service,
        ConfiguracionTiendaService $configService,
        TiendaMensajeService $mensajeService,
    ): RedirectResponse|JsonResponse {
        $checkoutSesion = $service->resolverPorToken($token);

        if (!$checkoutSesion) {
            abort(404);
        }

        if (!$service->verificarPertenencia($checkoutSesion, $request->user()->id)) {
            abort(403);
        }

        $action->execute($checkoutSesion, $configService->obtenerTiempoCheckoutMinutos());

        if ($request->expectsJson()) {
            $checkoutData = $this->enriquecerCheckoutResponse(
                $checkoutSesion->fresh(),
                $configService,
                $mensajeService,
            );

            return response()->json([
                'mensaje' => 'Reservas extendidas.',
                'checkout' => $checkoutData,
            ]);
        }

        return redirect()->back()->with('success', 'Tus reservas han sido extendidas.');
    }

    public function recalcularTotales(
        Request $request,
        string $token,
        ActualizarCheckoutTrasCambioCarritoAction $action,
        CheckoutService $service,
    ): RedirectResponse|JsonResponse {
        $checkoutSesion = $service->resolverPorToken($token);

        if (!$checkoutSesion) {
            abort(404);
        }

        if (!$service->verificarPertenencia($checkoutSesion, $request->user()->id)) {
            abort(403);
        }

        $checkoutSesion = $action->execute($checkoutSesion);

        if ($request->expectsJson()) {
            return response()->json([
                'mensaje' => 'Totales recalculados.',
                'checkout' => $checkoutSesion,
            ]);
        }

        return redirect()->back()->with('success', 'Totales del checkout actualizados.');
    }

    private function enriquecerCheckoutResponse(
        $checkoutSesion,
        ConfiguracionTiendaService $configService,
        TiendaMensajeService $mensajeService,
    ): array {
        $checkoutArray = $checkoutSesion->toArray();

        $expiraEn = $checkoutSesion->expira_en_che ?? $checkoutSesion->created_at->addMinutes(
            $configService->obtenerTiempoCheckoutMinutos()
        );

        $tiempoRestanteSegundos = $mensajeService->obtenerTiempoRestanteSegundos($expiraEn);
        $tiempoRestanteMinutos = $mensajeService->obtenerTiempoRestanteMinutos($expiraEn);

        $checkoutArray['tiempo_checkout'] = [
            'expira_en' => $expiraEn,
            'tiempo_restante_segundos' => $tiempoRestanteSegundos,
            'tiempo_restante_minutos' => $tiempoRestanteMinutos,
            'tiempo_restante_formateado' => $mensajeService->formatearTiempoRestante($tiempoRestanteSegundos),
            'ttl_minutos' => $configService->obtenerTiempoCheckoutMinutos(),
            'mensaje' => $tiempoRestanteSegundos > 0
                ? "Tienes {$tiempoRestanteMinutos} minutos para completar tu compra."
                : 'Tu tiempo de checkout ha expirado.',
            'expirado' => $tiempoRestanteSegundos <= 0,
        ];

        $reservas = $checkoutSesion->carrito
            ? $checkoutSesion->carrito->reservas()
                ->where('estado_res', 'activa')
                ->where('expira_en_res', '>', now())
                ->get()
            : collect();

        $reservaMasAntigua = $reservas->sortBy('expira_en_res')->first();

        $checkoutArray['reservas'] = [
            'cantidad_reservas_activas' => $reservas->count(),
            'expiracion_reserva' => $reservaMasAntigua?->expira_en_res,
            'tiempo_restante_segundos' => $reservaMasAntigua
                ? $mensajeService->obtenerTiempoRestanteSegundos($reservaMasAntigua->expira_en_res)
                : 0,
            'mensaje_reserva' => $reservas->isNotEmpty()
                ? 'Tus productos están reservados por tiempo limitado.'
                : 'No tienes productos reservados.',
        ];

        $checkoutArray['medios_pago'] = $configService->obtenerMediosPago();

        return $checkoutArray;
    }
}
