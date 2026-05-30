<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Models\CuentaCliente;
use App\Models\DireccionCliente;
use App\Models\PedidoTienda;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CuentaClienteDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $cuentaCliente = CuentaCliente::where('user_id', $user->id)->first();

        $pedidosCount = PedidoTienda::where('user_id', $user->id)->count();

        $direccionesCount = $cuentaCliente?->cod_cliente
            ? DireccionCliente::where('cod_cliente', $cuentaCliente->cod_cliente)
                ->where('activo_dir', true)
                ->count()
            : 0;

        return Inertia::render('Tienda/Cuenta/Index', [
            'cuentaCliente' => $cuentaCliente,
            'pedidosCount' => $pedidosCount,
            'direccionesCount' => $direccionesCount,
        ]);
    }
}
