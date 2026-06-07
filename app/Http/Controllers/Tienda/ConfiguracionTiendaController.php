<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Configuracion\Actions\ActualizarConfiguracionTiendaAction;
use App\Domains\Tienda\Configuracion\Actions\ObtenerConfiguracionTiendaAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\ActualizarConfiguracionTiendaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        Request $request,
        ActualizarConfiguracionTiendaRequest $formRequest,
        ActualizarConfiguracionTiendaAction $action,
    ): RedirectResponse|JsonResponse {
        $action->execute($request->user()->id, $formRequest->validated());

        if ($request->expectsJson()) {
            return response()->json(['success' => 'Configuración de tienda actualizada.']);
        }

        return redirect()->back()->with('success', 'Configuración de tienda actualizada.');
    }
}
