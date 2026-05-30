<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Cuenta\Actions\ActualizarDireccionClienteAction;
use App\Domains\Tienda\Cuenta\Actions\CrearDireccionClienteAction;
use App\Domains\Tienda\Cuenta\Actions\DesactivarDireccionClienteAction;
use App\Domains\Tienda\Cuenta\Actions\MarcarDireccionPredeterminadaAction;
use App\Domains\Tienda\Cuenta\DTOs\DireccionClienteData;
use App\Domains\Tienda\Cuenta\Services\DireccionClienteService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\StoreDireccionClienteRequest;
use App\Http\Requests\Tienda\UpdateDireccionClienteRequest;
use App\Models\CuentaCliente;
use App\Models\DireccionCliente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DireccionClienteController extends Controller
{
    public function index(Request $request, DireccionClienteService $service): Response
    {
        $this->authorize('viewAny', DireccionCliente::class);

        $cuenta = $this->resolverCuentaCliente($request);

        return Inertia::render('Tienda/Cuenta/Direcciones', [
            'direcciones' => $service->listarActivasPorCliente($cuenta->cod_cliente),
        ]);
    }

    public function store(
        StoreDireccionClienteRequest $request,
        CrearDireccionClienteAction $action,
    ): RedirectResponse {
        $cuenta = $this->resolverCuentaCliente($request);

        $action->execute(
            $cuenta->cod_cliente,
            DireccionClienteData::fromArray($request->validated()),
        );

        return redirect()->back()->with('success', 'Dirección creada correctamente.');
    }

    public function update(
        UpdateDireccionClienteRequest $request,
        DireccionCliente $direccion,
        ActualizarDireccionClienteAction $action,
    ): RedirectResponse {
        $this->authorize('update', $direccion);

        $action->execute($direccion, DireccionClienteData::fromArray($request->validated()));

        return redirect()->back()->with('success', 'Dirección actualizada correctamente.');
    }

    public function destroy(
        DireccionCliente $direccion,
        DesactivarDireccionClienteAction $action,
    ): RedirectResponse {
        $this->authorize('delete', $direccion);

        $action->execute($direccion);

        return redirect()->back()->with('success', 'Dirección eliminada correctamente.');
    }

    public function marcarPredeterminada(
        DireccionCliente $direccion,
        MarcarDireccionPredeterminadaAction $action,
    ): RedirectResponse {
        $this->authorize('update', $direccion);

        $action->execute($direccion);

        return redirect()->back()->with('success', 'Dirección predeterminada actualizada.');
    }

    private function resolverCuentaCliente(Request $request): CuentaCliente
    {
        return CuentaCliente::where('user_id', $request->user()->id)->firstOrFail();
    }
}
