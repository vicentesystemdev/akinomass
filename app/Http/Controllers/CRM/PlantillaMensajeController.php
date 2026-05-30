<?php

namespace App\Http\Controllers\CRM;

use App\Domains\CRM\Plantillas\Actions\ActualizarPlantillaMensajeAction;
use App\Domains\CRM\Plantillas\Actions\CambiarEstadoPlantillaMensajeAction;
use App\Domains\CRM\Plantillas\Actions\CrearPlantillaMensajeAction;
use App\Domains\CRM\Plantillas\Enums\TipoPlantillaMensajeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\PlantillasMensaje\StorePlantillaMensajeRequest;
use App\Http\Requests\PlantillasMensaje\UpdatePlantillaMensajeRequest;
use App\Models\PlantillaMensaje;
use Inertia\Inertia;
use Inertia\Response;

class PlantillaMensajeController extends Controller
{
    public function index(): Response
    {
        $this->authorize('leads.ver');

        $plantillas = PlantillaMensaje::latest()->paginate(15)->withQueryString();

        return Inertia::render('PlantillasMensaje/Index', [
            'plantillas' => $plantillas,
            'plantillasActivas' => $plantillas,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('leads.crear');

        return Inertia::render('PlantillasMensaje/Create', [
            'tipos' => array_column(TipoPlantillaMensajeEnum::cases(), 'value'),
        ]);
    }

    public function store(StorePlantillaMensajeRequest $request, CrearPlantillaMensajeAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('plantillas-mensaje.index');
    }

    public function edit(PlantillaMensaje $plantillas_mensaje): Response
    {
        $this->authorize('leads.editar');

        return Inertia::render('PlantillasMensaje/Edit', [
            'plantilla' => $plantillas_mensaje,
            'tipos' => array_column(TipoPlantillaMensajeEnum::cases(), 'value'),
        ]);
    }

    public function update(UpdatePlantillaMensajeRequest $request, PlantillaMensaje $plantillas_mensaje, ActualizarPlantillaMensajeAction $action)
    {
        $action->execute($plantillas_mensaje, $request->validated());

        return redirect()->route('plantillas-mensaje.index');
    }

    public function toggle(PlantillaMensaje $plantillas_mensaje, CambiarEstadoPlantillaMensajeAction $action)
    {
        $this->authorize('leads.editar');

        $action->execute($plantillas_mensaje);

        return redirect()->route('plantillas-mensaje.index');
    }
}
