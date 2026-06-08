<?php

namespace App\Domains\InteligenciaVentas\Services;

use App\Domains\InteligenciaVentas\DTOs\RecomendacionAbastecimientoData;
use App\Domains\InteligenciaVentas\Enums\EstadoDemandaEnum;
use App\Domains\InteligenciaVentas\Enums\NivelRecomendacionAbastecimientoEnum;
use App\Domains\InteligenciaVentas\Enums\NivelRiesgoStockEnum;
use App\Models\ConfiguracionInteligenciaVentas;

class RecomendacionAbastecimientoService
{
    public function calcular(int $ventasPeriodo, int $ventasEstimadas, int $stockActual, EstadoDemandaEnum $estadoPredicho, ConfiguracionInteligenciaVentas $configuracion): RecomendacionAbastecimientoData
    {
        $stockSeguridad = max((int) $configuracion->stock_seguridad_minimo, (int) round($ventasEstimadas * ((float) $configuracion->porcentaje_stock_seguridad / 100)));
        $cantidadSugerida = max(0, $ventasEstimadas + $stockSeguridad - $stockActual);

        $rotacion = $stockActual > 0 ? round($ventasPeriodo / $stockActual, 4) : ($ventasPeriodo > 0 ? 999.0 : 0.0);
        $cobertura = $ventasEstimadas > 0 ? round($stockActual / $ventasEstimadas, 4) : 999.0;

        $riesgo = match (true) {
            $ventasEstimadas === 0 => NivelRiesgoStockEnum::SIN_RIESGO,
            $cobertura < 0.50 => NivelRiesgoStockEnum::ALTO,
            $cobertura < 1.00 => NivelRiesgoStockEnum::MEDIO,
            default => NivelRiesgoStockEnum::BAJO,
        };

        $nivel = match (true) {
            $cantidadSugerida === 0 => NivelRecomendacionAbastecimientoEnum::NO_ABASTECER,
            $estadoPredicho === EstadoDemandaEnum::ALTA && $riesgo === NivelRiesgoStockEnum::ALTO => NivelRecomendacionAbastecimientoEnum::ALTA,
            $estadoPredicho === EstadoDemandaEnum::ALTA || $riesgo === NivelRiesgoStockEnum::MEDIO => NivelRecomendacionAbastecimientoEnum::MEDIA,
            $estadoPredicho === EstadoDemandaEnum::BAJA && $riesgo === NivelRiesgoStockEnum::BAJO => NivelRecomendacionAbastecimientoEnum::BAJA,
            default => NivelRecomendacionAbastecimientoEnum::MEDIA,
        };

        return new RecomendacionAbastecimientoData($cantidadSugerida, $nivel->value, $riesgo->value, $stockSeguridad, $cobertura, $rotacion);
    }
}
