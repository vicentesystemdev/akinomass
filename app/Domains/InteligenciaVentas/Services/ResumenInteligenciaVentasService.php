<?php

namespace App\Domains\InteligenciaVentas\Services;

use App\Models\PrediccionVenta;

class ResumenInteligenciaVentasService
{
    public function resumen(): array
    {
        return [
            'total_predicciones' => PrediccionVenta::count(),
            'abastecimiento_alto' => PrediccionVenta::where('nivel_recomendacion', 'alta')->count(),
            'unidades_sugeridas' => (int) PrediccionVenta::sum('cantidad_sugerida_abastecimiento'),
            'ingreso_estimado' => (float) PrediccionVenta::sum('ingreso_estimado'),
            'riesgo_alto' => PrediccionVenta::where('nivel_riesgo_stock', 'alto')->count(),
        ];
    }
}
