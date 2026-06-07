<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\PedidosWeb\Actions\AceptarPedidoTiendaAction;
use App\Domains\Tienda\PedidosWeb\Actions\RechazarPedidoTiendaAction;
use App\Http\Controllers\Controller;
use App\Models\PedidoTienda;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPedidoTiendaController extends Controller
{
    public function show(Request $request, PedidoTienda $pedidoTienda): Response|JsonResponse
    {
        $this->authorize('pedidos_tienda.revisar');

        $pedidoTienda->load(['pedido.cliente', 'pedido.detalles.producto', 'pago', 'factura', 'checkoutSesion']);

        $comprobantes = $pedidoTienda->pago
            ? \App\Models\ComprobantePagoTienda::where('cod_pago_tienda', $pedidoTienda->pago->cod_pago_tienda)
                ->with(['subidoPor', 'revisadoPor'])
                ->orderBy('subido_en_cpt', 'desc')
                ->get()
            : collect();

        if ($request->expectsJson()) {
            return response()->json([
                'pedidoTienda' => $pedidoTienda,
                'pedido' => $pedidoTienda->pedido,
                'pago' => $pedidoTienda->pago ?? null,
                'factura' => $pedidoTienda->factura ?? null,
                'comprobantes' => $comprobantes,
                'acciones_disponibles' => $this->obtenerAccionesDisponibles($pedidoTienda),
            ]);
        }

        return Inertia::render('Admin/Tienda/PedidoShow', [
            'pedidoTienda' => $pedidoTienda,
            'pedido' => $pedidoTienda->pedido,
            'pago' => $pedidoTienda->pago ?? null,
            'factura' => $pedidoTienda->factura ?? null,
            'comprobantes' => $comprobantes,
            'acciones_disponibles' => $this->obtenerAccionesDisponibles($pedidoTienda),
        ]);
    }

    public function aceptar(
        Request $request,
        PedidoTienda $pedidoTienda,
        AceptarPedidoTiendaAction $action,
    ): RedirectResponse|JsonResponse {
        $this->authorize('pedidos_tienda.aceptar');

        $action->execute($pedidoTienda);

        if ($request->expectsJson()) {
            return response()->json(['success' => 'Pedido aceptado. El cliente ya puede registrar su pago.']);
        }

        return redirect()->back()->with('success', 'Pedido aceptado. El cliente ya puede registrar su pago.');
    }

    public function rechazar(
        Request $request,
        PedidoTienda $pedidoTienda,
        RechazarPedidoTiendaAction $action,
    ): RedirectResponse|JsonResponse {
        $this->authorize('pedidos_tienda.rechazar');

        $motivo = $request->input('motivo', '');
        $action->execute($pedidoTienda, $motivo);

        if ($request->expectsJson()) {
            return response()->json(['success' => 'Pedido rechazado. Las reservas han sido liberadas.']);
        }

        return redirect()->back()->with('success', 'Pedido rechazado. Las reservas han sido liberadas.');
    }

    private function obtenerAccionesDisponibles(PedidoTienda $pedidoTienda): array
    {
        $acciones = [
            'aceptar_pedido' => false,
            'rechazar_pedido' => false,
            'aceptar_pago' => false,
            'observar_pago' => false,
            'rechazar_pago' => false,
        ];

        $estado = $pedidoTienda->estado_pte->value;

        if (in_array($estado, ['pendiente_revision'])) {
            $acciones['aceptar_pedido'] = true;
            $acciones['rechazar_pedido'] = true;
        }

        if (in_array($estado, ['pendiente_validacion_pago', 'pago_observado', 'pago_rechazado'])) {
            $acciones['aceptar_pago'] = true;
            $acciones['observar_pago'] = true;
            $acciones['rechazar_pago'] = true;
        }

        return $acciones;
    }
}
