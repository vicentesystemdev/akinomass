<?php

namespace App\Domains\InteligenciaVentas\Services;

use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class MetricasVentasService
{
    public function ventasEnDias(Collection $ventas, CarbonInterface $hasta, int $dias): int
    {
        $desde = $hasta->copy()->subDays($dias - 1)->startOfDay();

        return (int) $ventas
            ->filter(fn (array $venta) => $venta['fecha_carbon']->betweenIncluded($desde, $hasta))
            ->sum('cantidad');
    }

    public function ventasEntre(Collection $ventas, CarbonInterface $desde, CarbonInterface $hasta): int
    {
        return (int) $ventas
            ->filter(fn (array $venta) => $venta['fecha_carbon']->betweenIncluded($desde, $hasta))
            ->sum('cantidad');
    }

    public function tendencia(int $recientes, int $anteriores): float
    {
        if ($anteriores > 0) {
            return round((($recientes - $anteriores) / $anteriores) * 100, 2);
        }

        return $recientes > 0 ? 100.0 : 0.0;
    }

    public function precioPromedio(Collection $ventas): float
    {
        $cantidad = (float) $ventas->sum('cantidad');

        if ($cantidad <= 0) {
            return 0.0;
        }

        return round((float) $ventas->sum('subtotal') / $cantidad, 2);
    }
}
