<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Checkout\Actions\ActualizarDatosCheckoutAction;
use App\Domains\Tienda\Checkout\Actions\CancelarCheckoutAction;
use App\Domains\Tienda\Checkout\Actions\IniciarCheckoutAction;
use App\Domains\Tienda\Checkout\DTOs\ActualizarDatosCheckoutData;
use App\Domains\Tienda\Checkout\DTOs\IniciarCheckoutData;
use App\Domains\Tienda\Checkout\Services\CheckoutService;
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
    ): RedirectResponse|JsonResponse {
        $data = IniciarCheckoutData::fromArray($formRequest->validated());

        $checkoutSesion = $action->execute($request->user()->id, $data);

        if ($request->expectsJson()) {
            return response()->json([
                'mensaje' => 'Checkout iniciado.',
                'checkout' => $checkoutSesion,
                'token' => $checkoutSesion->token_che,
            ]);
        }

        return redirect()->route('tienda.checkout.show', $checkoutSesion->token_che);
    }

    public function show(
        string $token,
        CheckoutService $service,
        Request $request,
    ): Response|JsonResponse {
        $checkoutSesion = $service->resolverPorToken($token);

        if (!$checkoutSesion) {
            abort(404);
        }

        if (!$service->verificarPertenencia($checkoutSesion, $request->user()->id)) {
            abort(403);
        }

        if ($request->expectsJson()) {
            return response()->json(['checkout' => $checkoutSesion]);
        }

        $pedidoTienda = $checkoutSesion->pedidoTienda?->load('pedido');

        return Inertia::render('Tienda/Checkout/Index', [
            'checkout' => $checkoutSesion,
            'pedido' => $pedidoTienda,
        ]);
    }

    public function actualizarDatos(
        Request $request,
        string $token,
        ActualizarDatosCheckoutRequest $formRequest,
        ActualizarDatosCheckoutAction $action,
        CheckoutService $service,
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
            return response()->json([
                'mensaje' => 'Datos actualizados.',
                'checkout' => $checkoutSesion,
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
}
