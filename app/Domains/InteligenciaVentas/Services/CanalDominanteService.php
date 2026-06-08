<?php

namespace App\Domains\InteligenciaVentas\Services;

use App\Models\CanalVenta;
use Illuminate\Support\Collection;

class CanalDominanteService
{
    public function calcular(Collection $ventas): array
    {
        $total = (float) $ventas->sum('cantidad');
        if ($total <= 0) {
            return ['cod_canal_venta' => null, 'canal_dominante' => null, 'porcentaje_canal_dominante' => null, 'participacion_canal' => 0.0];
        }

        $porCanal = $ventas->groupBy('cod_canal_venta')->map(fn (Collection $items) => (float) $items->sum('cantidad'))->sortDesc();
        $codCanal = $porCanal->keys()->first();
        $cantidad = (float) $porCanal->first();
        $canal = $codCanal ? CanalVenta::find($codCanal) : null;

        return [
            'cod_canal_venta' => $codCanal ? (int) $codCanal : null,
            'canal_dominante' => $canal?->nombre_can,
            'porcentaje_canal_dominante' => round(($cantidad / $total) * 100, 2),
            'participacion_canal' => round($cantidad / $total, 4),
        ];
    }
}
