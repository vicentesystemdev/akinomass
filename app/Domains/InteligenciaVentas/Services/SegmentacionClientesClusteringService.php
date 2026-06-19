<?php

declare(strict_types=1);

namespace App\Domains\InteligenciaVentas\Services;

use Illuminate\Support\Collection;

final class SegmentacionClientesClusteringService
{
    private const CAMPOS = [
        'cantidad_pedidos_confirmados',
        'monto_total_comprado',
        'ticket_promedio',
        'dias_desde_ultima_compra',
        'frecuencia_compra',
        'cantidad_productos_distintos',
        'porcentaje_pedidos_pagados',
    ];

    public function segmentar(Collection|array $metricas, int $k = 3): array
    {
        $clientes = collect($metricas)->values();
        $k = max(2, min(6, $k));
        $clientesConCompra = $clientes->where('cantidad_pedidos_pagados', '>', 0)->count();

        if ($clientes->count() < $k || $clientesConCompra < $k) {
            return $this->sinDatos($clientes->count(), $k);
        }

        $normalizados = $this->normalizar($clientes);
        $centroides = $this->centroidesIniciales($normalizados, $k);
        $asignaciones = [];

        for ($iteracion = 0; $iteracion < 50; $iteracion++) {
            $nuevasAsignaciones = $normalizados
                ->map(fn (array $cliente): int => $this->centroideMasCercano($cliente['vector'], $centroides))
                ->all();

            if ($nuevasAsignaciones === $asignaciones) {
                break;
            }

            $asignaciones = $nuevasAsignaciones;
            $centroides = $this->recalcularCentroides($normalizados, $asignaciones, $centroides);
        }

        $segmentados = $clientes->map(function (array $cliente, int $indice) use ($normalizados, $asignaciones): array {
            return [
                ...$cliente,
                'cluster_original' => $asignaciones[$indice],
                'puntaje_valor_cliente' => $this->puntajeValor($normalizados[$indice]['normalizado']),
            ];
        });

        $estadisticas = $this->estadisticasClusters($segmentados, $k);
        $orden = $estadisticas->sortByDesc('puntaje_promedio')->values();
        $remapeo = $orden->mapWithKeys(fn (array $cluster, int $indice): array => [
            $cluster['cluster_original'] => $indice + 1,
        ]);

        $etiquetas = $this->etiquetas($orden);
        $clientesFinales = $segmentados->map(function (array $cliente) use ($remapeo, $etiquetas): array {
            $cluster = (int) $remapeo[$cliente['cluster_original']];
            $etiqueta = $etiquetas[$cluster];

            return [
                'cliente_id' => $cliente['cliente_id'],
                'nombre_cliente' => $cliente['nombre_cliente'],
                'cluster' => $cluster,
                'etiqueta_cluster' => $etiqueta,
                'puntaje_valor_cliente' => $cliente['puntaje_valor_cliente'],
                'cantidad_pedidos' => $cliente['cantidad_pedidos_confirmados'],
                'total_comprado' => $cliente['monto_total_comprado'],
                'ticket_promedio' => $cliente['ticket_promedio'],
                'ultima_compra' => $cliente['ultima_compra'],
                'dias_desde_ultima_compra' => $cliente['dias_desde_ultima_compra'],
                'recomendacion_comercial' => $this->recomendacion($etiqueta),
            ];
        })->sortByDesc('puntaje_valor_cliente')->values();

        $resumenClusters = $clientesFinales->groupBy('cluster')->map(function (Collection $items, int $cluster): array {
            return [
                'cluster' => $cluster,
                'etiqueta' => $items->first()['etiqueta_cluster'],
                'cantidad_clientes' => $items->count(),
                'puntaje_promedio' => round((float) $items->avg('puntaje_valor_cliente'), 2),
                'ticket_promedio' => round((float) $items->avg('ticket_promedio'), 2),
                'total_comprado' => round((float) $items->sum('total_comprado'), 2),
            ];
        })->sortBy('cluster')->values();

        $clusterMayorValor = $resumenClusters->sortByDesc('puntaje_promedio')->first();

        return [
            'suficientes_datos' => true,
            'mensaje' => null,
            'clusters_solicitados' => $k,
            'clientes' => $clientesFinales->all(),
            'resumen_clusters' => $resumenClusters->all(),
            'metricas' => [
                'clientes_analizados' => $clientesFinales->count(),
                'cluster_mayor_valor' => $clusterMayorValor['etiqueta'] ?? '-',
                'ticket_promedio_general' => round((float) $clientesFinales->avg('ticket_promedio'), 2),
                'clientes_en_riesgo' => $clientesFinales->filter(
                    fn (array $item): bool => str_contains(mb_strtolower($item['etiqueta_cluster']), 'riesgo'),
                )->count(),
            ],
        ];
    }

    private function normalizar(Collection $clientes): Collection
    {
        $rangos = collect(self::CAMPOS)->mapWithKeys(function (string $campo) use ($clientes): array {
            return [$campo => [
                'min' => (float) $clientes->min($campo),
                'max' => (float) $clientes->max($campo),
            ]];
        });

        return $clientes->map(function (array $cliente) use ($rangos): array {
            $normalizado = [];
            foreach (self::CAMPOS as $campo) {
                $min = $rangos[$campo]['min'];
                $max = $rangos[$campo]['max'];
                $normalizado[$campo] = $max === $min ? 0.0 : ((float) $cliente[$campo] - $min) / ($max - $min);
            }

            return [
                'vector' => array_values($normalizado),
                'normalizado' => $normalizado,
            ];
        });
    }

    private function centroidesIniciales(Collection $normalizados, int $k): array
    {
        $ordenados = $normalizados->sortBy(fn (array $item): float => $this->puntajeValor($item['normalizado']))->values();
        $ultimo = $ordenados->count() - 1;

        return collect(range(0, $k - 1))
            ->map(function (int $indice) use ($ordenados, $ultimo, $k): array {
                $posicion = $k === 1 ? 0 : (int) round(($indice * $ultimo) / ($k - 1));

                return $ordenados[$posicion]['vector'];
            })
            ->all();
    }

    private function centroideMasCercano(array $vector, array $centroides): int
    {
        $distancias = array_map(fn (array $centroide): float => $this->distancia($vector, $centroide), $centroides);

        return (int) array_search(min($distancias), $distancias, true);
    }

    private function distancia(array $a, array $b): float
    {
        return sqrt(array_sum(array_map(
            fn (float|int $valor, int $indice): float => ($valor - $b[$indice]) ** 2,
            $a,
            array_keys($a),
        )));
    }

    private function recalcularCentroides(Collection $normalizados, array $asignaciones, array $anteriores): array
    {
        return collect($anteriores)->map(function (array $anterior, int $cluster) use ($normalizados, $asignaciones): array {
            $vectores = $normalizados->filter(
                fn (array $item, int $indice): bool => $asignaciones[$indice] === $cluster,
            )->pluck('vector');

            if ($vectores->isEmpty()) {
                return $anterior;
            }

            return collect(array_keys($anterior))
                ->map(fn (int $dimension): float => (float) $vectores->avg(fn (array $vector): float => $vector[$dimension]))
                ->all();
        })->all();
    }

    private function puntajeValor(array $normalizado): float
    {
        $puntaje = ($normalizado['cantidad_pedidos_confirmados'] * 0.20)
            + ($normalizado['monto_total_comprado'] * 0.25)
            + ($normalizado['ticket_promedio'] * 0.15)
            + ((1 - $normalizado['dias_desde_ultima_compra']) * 0.05)
            + ($normalizado['frecuencia_compra'] * 0.15)
            + ($normalizado['cantidad_productos_distintos'] * 0.10)
            + ($normalizado['porcentaje_pedidos_pagados'] * 0.10);

        return round(max(0, min(100, $puntaje * 100)), 2);
    }

    private function estadisticasClusters(Collection $segmentados, int $k): Collection
    {
        return collect(range(0, $k - 1))->map(function (int $cluster) use ($segmentados): array {
            $items = $segmentados->where('cluster_original', $cluster);

            return [
                'cluster_original' => $cluster,
                'puntaje_promedio' => (float) $items->avg('puntaje_valor_cliente'),
                'recencia_promedio' => (float) $items->avg('dias_desde_ultima_compra'),
            ];
        });
    }

    private function etiquetas(Collection $orden): array
    {
        $total = $orden->count();
        $etiquetas = [];

        foreach ($orden as $indice => $cluster) {
            $posicion = $indice + 1;
            $etiquetas[$posicion] = match (true) {
                $indice === 0 => 'Cliente frecuente / alto valor',
                $indice === $total - 1 && $cluster['recencia_promedio'] >= 90 => 'Cliente en riesgo',
                $indice === $total - 1 => 'Cliente nuevo o de baja actividad',
                $indice === 1 => 'Cliente ocasional',
                default => 'Cliente de valor intermedio',
            };
        }

        return $etiquetas;
    }

    private function recomendacion(string $etiqueta): string
    {
        return match ($etiqueta) {
            'Cliente frecuente / alto valor' => 'Fidelizar con beneficios exclusivos, preventas y atención prioritaria.',
            'Cliente ocasional' => 'Activar campañas de recompra y recomendaciones según historial.',
            'Cliente en riesgo' => 'Ejecutar una campaña de recuperación con contacto personalizado.',
            'Cliente nuevo o de baja actividad' => 'Acompañar la primera recompra con contenido y promociones de entrada.',
            default => 'Mantener seguimiento periódico y ofertas segmentadas.',
        };
    }

    private function sinDatos(int $clientes, int $k): array
    {
        return [
            'suficientes_datos' => false,
            'mensaje' => 'No existen datos históricos suficientes para generar una segmentación confiable.',
            'clusters_solicitados' => $k,
            'clientes' => [],
            'resumen_clusters' => [],
            'metricas' => [
                'clientes_analizados' => $clientes,
                'cluster_mayor_valor' => '-',
                'ticket_promedio_general' => 0,
                'clientes_en_riesgo' => 0,
            ],
        ];
    }
}
