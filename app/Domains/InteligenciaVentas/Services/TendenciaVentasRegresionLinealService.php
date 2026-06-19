<?php

declare(strict_types=1);

namespace App\Domains\InteligenciaVentas\Services;

use Illuminate\Support\Collection;

final class TendenciaVentasRegresionLinealService
{
    public function analizar(Collection|array $serie): array
    {
        $periodos = collect($serie)->values();

        if ($periodos->count() < 3 || (float) $periodos->sum('valor') <= 0) {
            return $this->sinDatos($periodos);
        }

        $n = $periodos->count();
        $sumX = array_sum(range(0, $n - 1));
        $sumY = (float) $periodos->sum('valor');
        $sumXY = 0.0;
        $sumX2 = 0.0;

        foreach ($periodos as $x => $periodo) {
            $y = (float) $periodo['valor'];
            $sumXY += $x * $y;
            $sumX2 += $x ** 2;
        }

        $denominador = ($n * $sumX2) - ($sumX ** 2);
        $pendiente = $denominador === 0.0 ? 0.0 : (($n * $sumXY) - ($sumX * $sumY)) / $denominador;
        $intercepto = ($sumY - ($pendiente * $sumX)) / $n;

        $resultados = $periodos->map(function (array $periodo, int $x) use ($pendiente, $intercepto): array {
            return [
                'periodo' => $periodo['periodo'],
                'etiqueta' => $periodo['etiqueta'] ?? $periodo['periodo'],
                'valor_real' => round((float) $periodo['valor'], 2),
                'valor_estimado' => round(max(0, $intercepto + ($pendiente * $x)), 2),
            ];
        });

        $prediccionSiguiente = round(max(0, $intercepto + ($pendiente * $n)), 2);
        $rCuadrado = $this->rCuadrado($resultados);
        $promedio = $sumY / $n;
        $umbralEstable = max(0.01, abs($promedio) * 0.01);
        $direccion = match (true) {
            $pendiente > $umbralEstable => 'Creciente',
            $pendiente < -$umbralEstable => 'Decreciente',
            default => 'Estable',
        };
        $ultimaEstimacion = (float) $resultados->last()['valor_estimado'];
        $crecimiento = $ultimaEstimacion > 0
            ? (($prediccionSiguiente - $ultimaEstimacion) / $ultimaEstimacion) * 100
            : ($prediccionSiguiente > 0 ? 100.0 : 0.0);
        $confianza = $this->nivelConfianza($n, $rCuadrado);

        return [
            'suficientes_datos' => true,
            'mensaje' => null,
            'resultados' => $resultados->all(),
            'prediccion_siguiente_periodo' => $prediccionSiguiente,
            'pendiente' => round($pendiente, 4),
            'intercepto' => round($intercepto, 4),
            'direccion_tendencia' => $direccion,
            'porcentaje_crecimiento_estimado' => round($crecimiento, 2),
            'r_cuadrado' => round($rCuadrado, 4),
            'nivel_confianza' => $confianza,
            'recomendacion' => $this->recomendacion($direccion, $confianza, $prediccionSiguiente),
        ];
    }

    private function rCuadrado(Collection $resultados): float
    {
        $promedio = (float) $resultados->avg('valor_real');
        $sumaTotal = (float) $resultados->sum(
            fn (array $item): float => ((float) $item['valor_real'] - $promedio) ** 2,
        );
        $sumaErrores = (float) $resultados->sum(
            fn (array $item): float => ((float) $item['valor_real'] - (float) $item['valor_estimado']) ** 2,
        );

        if ($sumaTotal <= 0) {
            return $sumaErrores <= 0 ? 1.0 : 0.0;
        }

        return max(0, min(1, 1 - ($sumaErrores / $sumaTotal)));
    }

    private function nivelConfianza(int $periodos, float $rCuadrado): string
    {
        return match (true) {
            $periodos >= 6 && $rCuadrado >= 0.75 => 'Alta',
            $periodos >= 4 && $rCuadrado >= 0.40 => 'Media',
            default => 'Baja',
        };
    }

    private function recomendacion(string $direccion, string $confianza, float $prediccion): string
    {
        return match (true) {
            $direccion === 'Creciente' && $confianza !== 'Baja' => 'Aumentar compra',
            $direccion === 'Creciente' => 'Mantener compra',
            $direccion === 'Decreciente' => 'Reducir compra',
            $prediccion <= 0 => 'No abastecer por ahora',
            default => 'Mantener compra',
        };
    }

    private function sinDatos(Collection $periodos): array
    {
        return [
            'suficientes_datos' => false,
            'mensaje' => 'No existen datos históricos suficientes para calcular una tendencia confiable.',
            'resultados' => $periodos->map(fn (array $periodo): array => [
                'periodo' => $periodo['periodo'],
                'etiqueta' => $periodo['etiqueta'] ?? $periodo['periodo'],
                'valor_real' => round((float) $periodo['valor'], 2),
                'valor_estimado' => 0,
            ])->all(),
            'prediccion_siguiente_periodo' => 0,
            'pendiente' => 0,
            'intercepto' => 0,
            'direccion_tendencia' => 'Sin datos',
            'porcentaje_crecimiento_estimado' => 0,
            'r_cuadrado' => 0,
            'nivel_confianza' => 'Baja',
            'recomendacion' => 'No abastecer por ahora',
        ];
    }
}
