<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Configuracion\Actions\ActualizarConfiguracionTiendaAction;
use App\Domains\Tienda\Configuracion\Actions\ObtenerConfiguracionTiendaAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\ActualizarConfiguracionTiendaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ConfiguracionTiendaController extends Controller
{
    public function index(ObtenerConfiguracionTiendaAction $action): Response
    {
        $configuraciones = $action->execute();

        return Inertia::render('Tienda/Admin/Configuracion', [
            'configuraciones' => $configuraciones,
        ]);
    }

    public function actualizar(
        ActualizarConfiguracionTiendaRequest $request,
        ActualizarConfiguracionTiendaAction $action,
    ): RedirectResponse|JsonResponse {
        $datos = $request->validated();

        $archivosClave = ['pago_qr_imagen', 'pago_transferencia_imagen', 'pago_deposito_imagen'];
        foreach ($archivosClave as $clave) {
            if ($request->hasFile($clave)) {
                $datos[$clave] = $request->file($clave);
            }
        }

        $action->execute($request->user()->id, $datos);

        if ($request->expectsJson()) {
            return response()->json(['success' => 'Configuración de tienda actualizada.']);
        }

        return redirect()->back()->with('success', 'Configuración de tienda actualizada.');
    }
}
