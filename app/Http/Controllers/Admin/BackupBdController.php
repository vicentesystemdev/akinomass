<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Backups\Actions\DescargarBackupAction;
use App\Domains\Backups\Actions\GenerarBackupAction;
use App\Domains\Backups\Repositories\BackupBdRepository;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class BackupBdController extends Controller
{
    public function index(
        Request $request,
        BackupBdRepository $repository,
    ): Response {
        $this->authorize('backups.ver');

        $backups = $repository->paginar(15);

        return Inertia::render('Backups/Index', [
            'backups' => $backups,
        ]);
    }

    public function create(
        Request $request,
        GenerarBackupAction $action,
    ): RedirectResponse {
        $this->authorize('backups.generar');

        $resultado = $action->execute();

        if ($resultado->exitoso) {
            return redirect()->back()->with('success', "Backup {$resultado->tipo->value} generado exitosamente: {$resultado->archivo}");
        }

        return redirect()->back()->with('error', $resultado->error);
    }

    public function download(
        int $backup,
        DescargarBackupAction $action,
    ): StreamedResponse|\Illuminate\Http\Response {
        $this->authorize('backups.descargar');

        $response = $action->execute($backup);

        if (!$response) {
            abort(404, 'Backup no encontrado o no disponible para descarga.');
        }

        return $response;
    }
}
