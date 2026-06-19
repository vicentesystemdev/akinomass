<?php

namespace App\Domains\Backups\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExportadorJsonService
{
    /**
     * Exporta una tabla completa a JSON (backup base).
     */
    public function exportarCompleto(string $tableName, string $primaryKey): array
    {
        try {
            $records = DB::table($tableName)
                ->orderBy($primaryKey)
                ->get()
                ->map(fn ($record) => (array) $record)
                ->toArray();

            return [
                'tabla' => $tableName,
                'primary_key' => $primaryKey,
                'total_registros' => count($records),
                'registros' => $records,
            ];
        } catch (\Throwable $e) {
            Log::error("Error exportando tabla {$tableName}: " . $e->getMessage());

            return [
                'tabla' => $tableName,
                'primary_key' => $primaryKey,
                'total_registros' => 0,
                'registros' => [],
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Exporta registros modificados desde una fecha (backup incremental).
     */
    public function exportarIncremental(string $tableName, string $primaryKey, bool $hasTimestamps, string $desde, string $hasta): array
    {
        try {
            if (!$hasTimestamps) {
                return $this->exportarCompleto($tableName, $primaryKey);
            }

            $query = DB::table($tableName)->where(function ($q) use ($desde) {
                $q->where('created_at', '>', $desde)
                    ->orWhere('updated_at', '>', $desde);
            });

            $records = $query->orderBy($primaryKey)
                ->get()
                ->map(fn ($record) => (array) $record)
                ->toArray();

            return [
                'tabla' => $tableName,
                'primary_key' => $primaryKey,
                'total_registros' => count($records),
                'registros' => $records,
            ];
        } catch (\Throwable $e) {
            Log::error("Error exportando incremental tabla {$tableName}: " . $e->getMessage());

            return [
                'tabla' => $tableName,
                'primary_key' => $primaryKey,
                'total_registros' => 0,
                'registros' => [],
                'error' => $e->getMessage(),
            ];
        }
    }
}
