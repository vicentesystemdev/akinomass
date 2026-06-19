<?php

namespace App\Domains\Backups\Services;

use ZipArchive;
use Illuminate\Support\Facades\Log;

class CompressorZipService
{
    /**
     * Comprime un array de archivos JSON en un archivo ZIP.
     *
     * @param array<string, string> $archivosJson ['nombre_archivo.json' => 'contenido_json']
     * @param string $rutaDestino ruta completa del archivo ZIP a crear
     * @return bool true si fue exitoso
     */
    public function comprimir(array $archivosJson, string $rutaDestino): bool
    {
        try {
            $zip = new ZipArchive();

            if ($zip->open($rutaDestino, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                Log::error("No se pudo crear el ZIP en: {$rutaDestino}");

                return false;
            }

            foreach ($archivosJson as $nombreArchivo => $contenido) {
                $zip->addFromString($nombreArchivo, $contenido);
            }

            $zip->close();

            return true;
        } catch (\Throwable $e) {
            Log::error("Error comprimiendo ZIP: " . $e->getMessage());

            return false;
        }
    }
}
