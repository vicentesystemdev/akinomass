<?php

namespace App\Http\Controllers;

use App\Domains\Dashboard\Actions\VerDashboardComercialAction;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(VerDashboardComercialAction $action): Response
    {
        abort_unless(auth()->user()?->can('dashboard.ver'), 403);

        return Inertia::render('Dashboard', [
            'metricas' => $action->execute(),
        ]);
    }
}
