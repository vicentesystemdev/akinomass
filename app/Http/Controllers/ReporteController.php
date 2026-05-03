<?php

namespace App\Http\Controllers;

use App\Domains\Reportes\Actions\VerReportesComercialesAction;
use App\Http\Requests\Reportes\FiltrarReporteRequest;
use Inertia\Inertia;
use Inertia\Response;

class ReporteController extends Controller
{
    public function __invoke(FiltrarReporteRequest $request, VerReportesComercialesAction $action): Response
    {
        abort_unless(auth()->user()?->can('reportes.ver'), 403);

        $filtros = $request->validated();

        return Inertia::render('Reportes/Index', [
            'reportes' => $action->execute($filtros),
        ]);
    }
}
