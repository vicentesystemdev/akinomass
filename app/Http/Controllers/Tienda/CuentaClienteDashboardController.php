<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Mensajes\TiendaMensajeService;
use App\Http\Controllers\Controller;
use App\Models\CuentaCliente;
use App\Models\DireccionCliente;
use App\Models\PedidoTienda;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CuentaClienteDashboardController extends Controller
{
    public function index(Request $request, TiendaMensajeService $mensajeService): Response
    {
        $user = $request->user();

        $cuentaCliente = CuentaCliente::where('user_id', $user->id)->first();

        $pedidosCount = PedidoTienda::where('user_id', $user->id)->count();

        $direccionesCount = $cuentaCliente?->cod_cliente
            ? DireccionCliente::where('cod_cliente', $cuentaCliente->cod_cliente)
                ->where('activo_dir', true)
                ->count()
            : 0;

        $pedidosRecientes = PedidoTienda::where('user_id', $user->id)
            ->with('pedido')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($pedido) use ($mensajeService) {
                $pedidoArray = $pedido->toArray();
                $pedidoArray['mensaje_estado'] = $mensajeService->obtenerMensajePedido($pedido->estado_pte);
                $pedidoArray['puede_resubir_comprobante'] = $mensajeService->puedeResubirComprobante(
                    $pedido->estado_pte,
                    $pedido->pago?->estado_pago_pag
                );
                return $pedidoArray;
            });

        return Inertia::render('Tienda/Cuenta/Index', [
            'cuentaCliente' => $cuentaCliente,
            'pedidosCount' => $pedidosCount,
            'direccionesCount' => $direccionesCount,
            'pedidosRecientes' => $pedidosRecientes,
            'mensajesEstado' => [
                'pendiente_revision' => 'Tu pedido está pendiente de revisión.',
                'aceptado' => 'Tu pedido fue aceptado. Estamos revisando tu pago.',
                'rechazado' => 'Tu pedido fue rechazado.',
                'pago_observado' => 'Tu comprobante fue observado.',
                'pago_rechazado' => 'Tu pago fue rechazado.',
                'confirmado' => 'Tu pago fue aceptado y tu pedido confirmado.',
                'facturado' => 'Tu comprobante interno está disponible.',
            ],
        ]);
    }
}
