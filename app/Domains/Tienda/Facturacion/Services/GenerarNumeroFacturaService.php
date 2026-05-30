<?php

namespace App\Domains\Tienda\Facturacion\Services;

use App\Models\Factura;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class GenerarNumeroFacturaService
{
    public function generar(): string
    {
        $anio = date('Y');
        $cacheKey = "factura_secuencia_{$anio}";

        return Cache::lock($cacheKey . '_lock', 5)->block(3, function () use ($anio, $cacheKey) {
            $ultimoNumero = Cache::get($cacheKey, 0);
            $nuevoNumero = $ultimoNumero + 1;

            Cache::forever($cacheKey, $nuevoNumero);

            return 'FAC-' . $anio . '-' . str_pad((string) $nuevoNumero, 6, '0', STR_PAD_LEFT);
        });
    }
}
