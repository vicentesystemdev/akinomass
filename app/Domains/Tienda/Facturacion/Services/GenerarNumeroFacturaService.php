<?php

namespace App\Domains\Tienda\Facturacion\Services;

use App\Models\Factura;
use Illuminate\Support\Facades\Cache;

class GenerarNumeroFacturaService
{
    public function generar(): string
    {
        $anio = date('Y');
        $cacheKey = "factura_secuencia_{$anio}";

        return Cache::lock($cacheKey . '_lock', 5)->block(3, function () use ($anio, $cacheKey) {
            $numero = Cache::get($cacheKey);

            if ($numero === null) {
                $numero = Factura::where('numero_factura_fac', 'like', "FAC-{$anio}-%")
                    ->selectRaw("MAX(CAST(SUBSTR(numero_factura_fac, 9) AS INTEGER)) as max_num")
                    ->value('max_num') ?? 0;
            }

            $intentos = 0;

            do {
                $numero++;
                $factura = 'FAC-' . $anio . '-' . str_pad((string) $numero, 6, '0', STR_PAD_LEFT);
                $existe = Factura::where('numero_factura_fac', $factura)->exists();
                $intentos++;
            } while ($existe && $intentos < 100);

            Cache::forever($cacheKey, $numero);

            return $factura;
        });
    }
}
