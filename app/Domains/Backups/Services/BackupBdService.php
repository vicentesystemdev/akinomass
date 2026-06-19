<?php

namespace App\Domains\Backups\Services;

use App\Domains\Backups\Enums\EstadoBackupEnum;
use App\Domains\Backups\Enums\TipoBackupEnum;
use App\Models\BackupBd;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BackupBdService
{
    public function __construct(
        private ExportadorJsonService $exportador,
        private CompressorZipService $compresor,
    ) {}

    public function obtenerUltimoBackupExitoso(): ?BackupBd
    {
        return BackupBd::where('bck_estado', EstadoBackupEnum::EXITOSO)
            ->orderByDesc('bck_hasta')
            ->first();
    }

    public function hayBackupEnProceso(): bool
    {
        return BackupBd::where('bck_estado', EstadoBackupEnum::EN_PROCESO)
            ->exists();
    }

    public function crearRegistroInicial(int $userId): BackupBd
    {
        return BackupBd::create([
            'usu_id' => $userId,
            'bck_estado' => EstadoBackupEnum::EN_PROCESO,
            'bck_fecha' => now(),
        ]);
    }

    public function ejecutarBackup(BackupBd $backup, TipoBackupEnum $tipo, ?string $desde, string $hasta): bool
    {
        $config = config('backups.tables', []);
        $disk = config('backups.disk', 'local');
        $path = config('backups.path', 'private/backups_bd');

        $archivosJson = [];
        $archivosJson['manifest.json'] = $this->generarManifest($tipo, $desde, $hasta, $config);

        foreach ($config as $tableName => $tableConfig) {
            $primaryKey = $tableConfig['primary_key'] ?? 'id';
            $hasTimestamps = $tableConfig['timestamps'] ?? true;

            $datos = $tipo === TipoBackupEnum::BASE
                ? $this->exportador->exportarCompleto($tableName, $primaryKey)
                : $this->exportador->exportarIncremental($tableName, $primaryKey, $hasTimestamps, $desde, $hasta);

            $archivosJson["{$tableName}.json"] = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        $nombreArchivo = $this->generarNombreArchivo($tipo);
        $rutaCompleta = storage_path("app/private/backups_bd/{$nombreArchivo}");

        $directorio = dirname($rutaCompleta);
        if (!is_dir($directorio)) {
            mkdir($directorio, 0755, true);
        }

        $exitoso = $this->compresor->comprimir($archivosJson, $rutaCompleta);

        if ($exitoso) {
            $backup->update([
                'bck_tipo' => $tipo,
                'bck_archivo' => $nombreArchivo,
                'bck_ruta' => "{$path}/{$nombreArchivo}",
                'bck_estado' => EstadoBackupEnum::EXITOSO,
                'bck_desde' => $desde,
                'bck_hasta' => $hasta,
            ]);
        } else {
            $backup->update([
                'bck_tipo' => $tipo,
                'bck_estado' => EstadoBackupEnum::FALLIDO,
                'bck_error' => 'No se pudo crear el archivo ZIP.',
                'bck_desde' => $desde,
                'bck_hasta' => $hasta,
            ]);
        }

        return $exitoso;
    }

    public function marcarFallido(BackupBd $backup, string $error): void
    {
        $backup->update([
            'bck_estado' => EstadoBackupEnum::FALLIDO,
            'bck_error' => $error,
        ]);
    }

    private function generarNombreArchivo(TipoBackupEnum $tipo): string
    {
        $fecha = now()->format('Y_m_d_His');
        $sufijo = $tipo === TipoBackupEnum::BASE ? 'base' : 'incremental';

        return "backup_{$sufijo}_akinomass_{$fecha}.zip";
    }

    private function generarManifest(TipoBackupEnum $tipo, ?string $desde, string $hasta, array $config): string
    {
        $manifest = [
            'sistema' => 'AKINOMASS',
            'tipo_backup' => $tipo->value,
            'generado_en' => now()->toIso8601String(),
            'desde' => $desde,
            'hasta' => $hasta,
            'tablas' => array_keys($config),
            'total_tablas' => count($config),
            'version' => '1.0',
            'generado_por' => auth()->id(),
            'observacion' => null,
        ];

        return json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
