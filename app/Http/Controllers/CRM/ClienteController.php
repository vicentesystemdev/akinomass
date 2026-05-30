<?php

namespace App\Http\Controllers\CRM;

use App\Domains\CRM\Clientes\Actions\ActualizarClienteAction;
use App\Domains\CRM\Clientes\Actions\CrearClienteAction;
use App\Domains\CRM\Clientes\Enums\EstadoClienteEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Clientes\StoreClienteRequest;
use App\Http\Requests\Clientes\UpdateClienteRequest;
use App\Models\CanalVenta;
use App\Models\Cliente;
use App\Models\TipoFlujoComercial;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    private function canales() { return Cache::rememberForever('lookup:canales_venta', fn() => CanalVenta::all()->values()->toArray()); }
    private function tiposFlujo() { return Cache::rememberForever('lookup:tipos_flujo', fn() => TipoFlujoComercial::all()->values()->toArray()); }
    private function estadosCliente() { return array_column(EstadoClienteEnum::cases(), 'value'); }

    public function index(): Response
    {
        $this->authorize('clientes.ver');

        return Inertia::render('Clientes/Index', [
            'clientes' => Cliente::with(['canalVenta', 'tipoFlujoComercial'])->latest()->paginate(15)->withQueryString(),
            'canales' => $this->canales(),
            'tiposFlujo' => $this->tiposFlujo(),
            'estados' => $this->estadosCliente(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('clientes.crear');

        return Inertia::render('Clientes/Create', [
            'canales' => $this->canales(),
            'tiposFlujo' => $this->tiposFlujo(),
            'estados' => $this->estadosCliente(),
        ]);
    }

    public function store(StoreClienteRequest $request, CrearClienteAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('clientes.index');
    }

    public function edit(Cliente $cliente): Response
    {
        $this->authorize('clientes.editar');

        return Inertia::render('Clientes/Edit', [
            'cliente' => $cliente,
            'canales' => $this->canales(),
            'tiposFlujo' => $this->tiposFlujo(),
            'estados' => $this->estadosCliente(),
        ]);
    }

    public function update(UpdateClienteRequest $request, Cliente $cliente, ActualizarClienteAction $action)
    {
        $action->execute($cliente, $request->validated());

        return redirect()->route('clientes.index');
    }
}
