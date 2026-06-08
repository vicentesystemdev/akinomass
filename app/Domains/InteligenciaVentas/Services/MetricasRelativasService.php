<?php

namespace App\Domains\InteligenciaVentas\Services;

class MetricasRelativasService
{
    public function dividir(float|int $numerador, float|int $denominador): float
    {
        if ((float) $denominador === 0.0) {
            return 0.0;
        }

        return round((float) $numerador / (float) $denominador, 4);
    }

    public function variacion(float $valor, float $promedio): float
    {
        if ($promedio <= 0) {
            return $valor > 0 ? 100.0 : 0.0;
        }

        return round((($valor - $promedio) / $promedio) * 100, 2);
    }
}
