<?php

namespace App\Domains\InteligenciaVentas\Services;

use App\Domains\InteligenciaVentas\Enums\EstadoDemandaEnum;
use App\Models\ConfiguracionInteligenciaVentas;

class PrediccionDemandaService
{
    public function estimar(float $promedio, float $tendenciaPorcentual, EstadoDemandaEnum $estadoPredicho, ConfiguracionInteligenciaVentas $configuracion): array
    {
        $factorTendencia = 1 + ($tendenciaPorcentual / 100);
        $factorTendencia = max((float) $configuracion->limite_factor_tendencia_min, min((float) $configuracion->limite_factor_tendencia_max, $factorTendencia));

        $factorEstado = match ($estadoPredicho) {
            EstadoDemandaEnum::BAJA => 0.85,
            EstadoDemandaEnum::MEDIA => 1.00,
            EstadoDemandaEnum::ALTA => 1.15,
        };

        $estimadas = (int) round($promedio * $factorTendencia * $factorEstado);

        return [
            'ventas_estimadas_proximo_periodo' => max(0, $estimadas),
            'rango_estimado_minimo' => max(0, (int) round($estimadas * 0.85)),
            'rango_estimado_maximo' => max(0, (int) round($estimadas * 1.15)),
            'factor_tendencia' => round($factorTendencia, 4),
        ];
    }
}
