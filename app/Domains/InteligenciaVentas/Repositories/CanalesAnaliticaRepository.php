<?php

namespace App\Domains\InteligenciaVentas\Repositories;

use App\Models\PrediccionVenta;
use Illuminate\Support\Collection;

class CanalesAnaliticaRepository
{
    public function resumenCanales(): Collection
    {
        $predicciones = PrediccionVenta::with(['canalVenta', 'categoria', 'producto'])
            ->whereNotNull('cod_canal_venta')
            ->get();

        $totalIngreso = max((float) $predicciones->sum('ingreso_estimado'), 1);

        return $predicciones->groupBy('cod_canal_venta')->map(function ($items) use ($totalIngreso) {
            $first = $items->first();
            $categoria = $items->groupBy('cod_categoria_producto')
                ->sortByDesc(fn ($grupo) => $grupo->sum('ventas_periodo'))
                ->first()
                ?->first()
                ?->categoria;
            $producto = $items->sortByDesc('ventas_periodo')->first()?->producto;

            return [
                'cod_canal_venta' => $first->cod_canal_venta,
                'canal_venta' => $first->canalVenta,
                'ventas_estimadas' => $items->sum('ventas_estimadas_proximo_periodo'),
                'unidades_vendidas' => $items->sum('ventas_periodo'),
                'ingreso_estimado' => $items->sum('ingreso_estimado'),
                'categoria_mas_vendida' => $categoria,
                'producto_mas_vendido' => $producto,
                'participacion_promedio' => round(((float) $items->sum('ingreso_estimado') / $totalIngreso) * 100, 2),
                'tendencia_porcentual' => round((float) $items->avg('tendencia_porcentual'), 2),
            ];
        })->values();
    }
}
