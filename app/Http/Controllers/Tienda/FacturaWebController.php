<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Facturacion\Actions\ObtenerFacturaClienteAction;
use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacturaWebController extends Controller
{
    public function show(
        Pedido $pedido,
        ObtenerFacturaClienteAction $action,
        Request $request,
    ): Response|JsonResponse {
        $factura = $action->execute($request->user()->id, $pedido->cod_pedido);

        if (!$factura) {
            abort(404);
        }

        $factura->load(['detalles', 'pago']);

        if ($request->expectsJson()) {
            return response()->json([
                'factura' => $factura,
                'pedido' => $pedido,
            ]);
        }

        return Inertia::render('Tienda/FacturaShow', [
            'factura' => $factura,
            'pedido' => $pedido,
        ]);
    }
}
