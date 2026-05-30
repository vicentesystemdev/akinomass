<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\PagosWeb\Actions\ObtenerPagoClienteAction;
use App\Domains\Tienda\PagosWeb\Actions\RegistrarPagoDesdeCheckoutAction;
use App\Domains\Tienda\PagosWeb\DTOs\RegistrarPagoDesdeCheckoutData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\RegistrarPagoCheckoutRequest;
use App\Models\Pedido;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
    ): Response|JsonResponse {
        $pagoTienda = $action->execute($request->user()->id, $pedido->cod_pedido);

        if (!$pagoTienda) {
            abort(404);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'pago' => $pagoTienda,
                'pedido' => $pedido,
            ]);
        }

        return Inertia::render('Tienda/Cuenta/PagoShow', [
            'pago' => $pagoTienda,
            'pedido' => $pedido,
        ]);
    }
}
