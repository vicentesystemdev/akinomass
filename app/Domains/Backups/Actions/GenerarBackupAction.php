<?php

namespace App\Domains\Backups\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Backups\DTOs\ResultadoBackupDTO;
use App\Domains\Backups\Enums\TipoBackupEnum;
use App\Domains\Backups\Services\BackupBdService;
use App\Models\BackupBd;
use Illuminate\Support\Facades\Log;
use Throwable;

class GenerarBackupAction
{
    public function __construct(
        private BackupBdService $service,
        private ?RegistrarAuditoriaService $auditoriaService = null,
    ) {}

    public function execute(): ResultadoBackupDTO
    {
        if ($this->service->hayBackupEnProceso()) {
            return ResultadoBackupDTO::fallido(
                TipoBackupEnum::BASE,
                'Ya existe un backup en proceso. Espere a que finalice antes de generar otro.'
            );
        }

        $userId = auth()->id();
        $backup = $this->service->crearRegistroInicial($userId);

        try {
            $ultimoBackup = $this->service->obtenerUltimoBackupExitoso();

            $tipo = $ultimoBackup ? TipoBackupEnum::INCREMENTAL : TipoBackupEnum::BASE;
            $desde = $ultimoBackup?->bck_hasta?->toDateTimeString();
            $hasta = now()->toDateTimeString();

            $exitoso = $this->service->ejecutarBackup($backup, $tipo, $desde, $hasta);

            $backup->refresh();

            $this->registrarAuditoria($backup, $tipo, $exitoso);

            return new ResultadoBackupDTO(
                exitoso: $exitoso,
                tipo: $tipo,
                estado: $backup->bck_estado,
                archivo: $backup->bck_archivo,
                error: $backup->bck_error,
            );
        } catch (Throwable $e) {
            Log::error('Error en GenerarBackupAction: ' . $e->getMessage());

            $this->service->marcarFallido($backup, $e->getMessage());

            return ResultadoBackupDTO::fallido(
                $tipo ?? TipoBackupEnum::BASE,
                $e->getMessage()
            );
        }
    }

    private function registrarAuditoria(BackupBd $backup, TipoBackupEnum $tipo, bool $exitoso): void
    {
        if (!$this->auditoriaService) {
            return;
        }

        try {
            $contexto = RegistrarAuditoriaData::fromRequest(request());
            $descripcion = $exitoso
                ? "Se generó el backup {$tipo->value} {$backup->bck_archivo}."
                : "Falló la generación del backup {$tipo->value}. Error: {$backup->bck_error}";

            $this->auditoriaService->registrarInsercion(
                $contexto,
                'Backups',
                'backups_bd',
                (string) $backup->bck_id,
                submodulo: 'Generación',
                descripcion: $descripcion,
            );
        } catch (Throwable $e) {
            Log::warning('No se pudo registrar auditoría para backup: ' . $e->getMessage());
        }
    }
}
