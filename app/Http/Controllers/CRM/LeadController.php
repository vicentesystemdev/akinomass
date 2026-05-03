<?php

namespace App\Http\Controllers\CRM;

use App\Domains\CRM\Leads\Actions\ActualizarEstadoLeadAction;
use App\Domains\CRM\Leads\Actions\ActualizarLeadAction;
use App\Domains\CRM\Leads\Actions\ConvertirLeadEnClienteAction;
use App\Domains\CRM\Leads\Actions\RegistrarLeadAction;
use App\Domains\CRM\Leads\Enums\EstadoLeadEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Leads\StoreLeadRequest;
use App\Http\Requests\Leads\UpdateEstadoLeadRequest;
use App\Http\Requests\Leads\UpdateLeadRequest;
use App\Models\CanalVenta;
use App\Models\Lead;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(): Response
    {
        $this->authorize('leads.ver');

        return Inertia::render('Leads/Index', [
            'leads' => Lead::with(['canalVenta', 'tipoFlujoComercial', 'cliente', 'usuarioResponsable'])->latest()->get(),
            'estados' => array_column(EstadoLeadEnum::cases(), 'value'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('leads.crear');

        return Inertia::render('Leads/Create', [
            'canales' => CanalVenta::all(),
            'tiposFlujo' => TipoFlujoComercial::all(),
            'usuarios' => User::select('id', 'name')->get(),
            'estados' => array_column(EstadoLeadEnum::cases(), 'value'),
        ]);
    }

    public function store(StoreLeadRequest $request, RegistrarLeadAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('leads.index');
    }

    public function edit(Lead $lead): Response
    {
        $this->authorize('leads.editar');

        return Inertia::render('Leads/Edit', [
            'lead' => $lead,
            'canales' => CanalVenta::all(),
            'tiposFlujo' => TipoFlujoComercial::all(),
            'usuarios' => User::select('id', 'name')->get(),
            'estados' => array_column(EstadoLeadEnum::cases(), 'value'),
        ]);
    }

    public function update(UpdateLeadRequest $request, Lead $lead, ActualizarLeadAction $action)
    {
        $action->execute($lead, $request->validated());

        return redirect()->route('leads.index');
    }

    public function updateEstado(UpdateEstadoLeadRequest $request, Lead $lead, ActualizarEstadoLeadAction $action)
    {
        $action->execute($lead, $request->validated()['estado_lea']);

        return redirect()->route('leads.index');
    }

    public function convertir(Lead $lead, ConvertirLeadEnClienteAction $action)
    {
        $this->authorize('leads.convertir');

        $action->execute($lead);

        return redirect()->route('clientes.index');
    }
}
