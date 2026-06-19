<?php

namespace App\Domains\Backups\Actions;

use App\Domains\Backups\Enums\EstadoBackupEnum;
use App\Domains\Backups\Repositories\BackupBdRepository;
use App\Models\BackupBd;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DescargarBackupAction
{
    public function __construct(
        private BackupBdRepository $repository,
    ) {}

    public function execute(int $backupId): ?StreamedResponse
    {
        $backup = $this->repository->obtenerPorId($backupId);

        if (!$backup) {
            return null;
        }

        if ($backup->bck_estado !== EstadoBackupEnum::EXITOSO) {
            return null;
        }

        $disk = config('backups.disk', 'local');
        $rutaRelativa = $backup->bck_ruta;

        if (!Storage::disk($disk)->exists($rutaRelativa)) {
            return null;
        }

        $nombreDescarga = $backup->bck_archivo;

        return Storage::disk($disk)->download($rutaRelativa, $nombreDescarga, [
            'Content-Type' => 'application/zip',
        ]);
    }
}
