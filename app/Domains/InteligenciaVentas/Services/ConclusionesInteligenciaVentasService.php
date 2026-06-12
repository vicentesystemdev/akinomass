<?php

namespace App\Domains\InteligenciaVentas\Services;

use App\Domains\InteligenciaVentas\DTOs\ConclusionesInteligenciaVentasData;
use App\Domains\InteligenciaVentas\Repositories\ConfiguracionInteligenciaVentasRepository;
use App\Domains\InteligenciaVentas\Repositories\PrediccionVentasRepository;
use App\Models\PrediccionVenta;
use Illuminate\Support\Collection;

class ConclusionesInteligenciaVentasService
{
    private const ESCENARIOS = [
        'conservador' => [
            'nombre' => 'Escenario conservador',
            'factor' => 0.60,
            'motivo' => 'Reduce la inversion inicial priorizando productos con mayor rotacion y menor riesgo de stock. Es adecuado si se desea cuidar liquidez.',
        ],
        'recomendado' => [
            'nombre' => 'Escenario recomendado',
            'factor' => 1.00,
            'motivo' => 'Equilibra inversion y oportunidad comercial. Prioriza productos con buena proyeccion, stock insuficiente y margen estimado favorable.',
        ],
        'agresivo' => [
            'nombre' => 'Escenario agresivo',
            'factor' => 1.40,
            'motivo' => 'Busca mayor ganancia potencial aumentando el abastecimiento en productos con proyeccion alta, pero implica mayor riesgo si la demanda no se cumple.',
        ],
    ];

    private const TEMPORADAS = [
        'invierno' => ['abrigo', 'abrigos', 'chompa', 'chompas', 'buzo', 'buzos', 'pantalon', 'pantalones', 'termica', 'termico', 'lana', 'bufanda'],
        'verano' => ['polera', 'poleras', 'blusa', 'blusas', 'vestido', 'vestidos', 'short', 'shorts', 'liviana', 'liviano', 'verano'],
        'otono' => ['pantalon', 'pantalones', 'blusa', 'blusas', 'chaqueta', 'chaquetas', 'transicion', 'liviana', 'otoño', 'otono'],
        'primavera' => ['blusa', 'blusas', 'vestido', 'vestidos', 'polera', 'poleras', 'liviana', 'liviano', 'color', 'primavera'],
    ];

    public function __construct(
        private readonly PrediccionVentasRepository $predicciones,
        private readonly ConfiguracionInteligenciaVentasRepository $configuraciones,
    ) {}

    public function construir(ConclusionesInteligenciaVentasData $filtros): array
    {
        $configuracion = $this->configuraciones->activa();
        $opcionesItems = $this->predicciones->conclusiones();
        $items = $this->predicciones->conclusiones($filtros->toArray());
        $coincidenciaTemporada = false;

        if ($filtros->tipoAnalisis === 'temporada') {
            $filtrados = $this->filtrarPorTemporada($items, $filtros->temporada);
            $coincidenciaTemporada = $filtrados->isNotEmpty();
            $items = $coincidenciaTemporada ? $filtrados : $items;
        }

        $productos = $items->map(fn (PrediccionVenta $prediccion) => $this->mapProducto($prediccion, $filtros, $configuracion))->values();
        $escenarios = collect(self::ESCENARIOS)
            ->map(fn (array $escenario, string $clave) => $this->calcularEscenario($clave, $escenario, $productos, $filtros))
            ->values();
        $recomendado = $escenarios->firstWhere('clave', 'recomendado') ?? $this->escenarioVacio('recomendado', self::ESCENARIOS['recomendado']);
        $categorias = $this->categorias($productos);
        $noAbastecer = $this->noAbastecer($items);

        return [
            'filtros' => $filtros->toArray(),
            'opciones' => [
                'categorias' => $opcionesItems->filter(fn (PrediccionVenta $item) => $item->categoria)
                    ->map(fn (PrediccionVenta $item): array => [
                        'value' => $item->cod_categoria_producto,
                        'label' => $item->categoria?->nombre_cat,
                    ])
                    ->unique('value')
                    ->values(),
                'canales' => $opcionesItems->filter(fn (PrediccionVenta $item) => $item->canalVenta)
                    ->map(fn (PrediccionVenta $item): array => [
                        'value' => $item->cod_canal_venta,
                        'label' => $item->canalVenta?->nombre_can,
                    ])
                    ->unique('value')
                    ->values(),
            ],
            'resumen' => [
                'inversion_recomendada' => $recomendado['costo_inversion'],
                'ganancia_estimada' => $recomendado['ganancia_estimada'],
                'roi_estimado' => $recomendado['roi_estimado'],
                'unidades_sugeridas' => $recomendado['unidades_sugeridas'],
                'categoria_prioritaria' => $categorias->first()['categoria'] ?? '-',
                'riesgo_general' => $recomendado['riesgo'],
                'canal_relevante' => $this->canalRelevante($productos),
            ],
            'conclusion_general' => $this->conclusionGeneral($productos, $categorias, $recomendado, $filtros),
            'escenarios' => $escenarios,
            'productos_recomendados' => $productos->filter(fn (array $producto) => $producto['cantidad_recomendada'] > 0)->values(),
            'categorias_recomendadas' => $categorias,
            'no_abastecer' => $noAbastecer,
            'temporada' => $this->temporada($filtros, $coincidenciaTemporada, $categorias, $productos),
        ];
    }

    private function mapProducto(PrediccionVenta $prediccion, ConclusionesInteligenciaVentasData $filtros, $configuracion): array
    {
        $precioVenta = $this->precioVenta($prediccion);
        [$costoUnitario, $costoEstimado] = $this->costoUnitario($prediccion, $precioVenta);
        $cantidadBase = (int) $prediccion->cantidad_sugerida_abastecimiento;
        $factorPeriodo = $this->factorPeriodo($prediccion, $filtros, $configuracion);
        $cantidadRecomendada = max(0, (int) round($cantidadBase * $factorPeriodo));

        return [
            'cod_prediccion_venta' => $prediccion->cod_prediccion_venta,
            'producto' => $prediccion->producto?->nombre_pro ?? $prediccion->codigo_prediccion,
            'categoria' => $prediccion->categoria?->nombre_cat ?? '-',
            'canal' => $prediccion->canalVenta?->nombre_can ?? $prediccion->canal_dominante ?? '-',
            'cantidad_base' => $cantidadBase,
            'cantidad_conservadora' => $this->cantidadEscenario($cantidadRecomendada, self::ESCENARIOS['conservador']['factor']),
            'cantidad_recomendada' => $cantidadRecomendada,
            'cantidad_agresiva' => $this->cantidadEscenario($cantidadRecomendada, self::ESCENARIOS['agresivo']['factor']),
            'precio_venta' => round($precioVenta, 2),
            'costo_unitario' => round($costoUnitario, 2),
            'costo_estimado' => $costoEstimado,
            'costo_estimado_total' => round($cantidadRecomendada * $costoUnitario, 2),
            'ingreso_estimado' => round($cantidadRecomendada * $precioVenta, 2),
            'ganancia_estimada' => round($cantidadRecomendada * ($precioVenta - $costoUnitario), 2),
            'riesgo' => $this->riesgoProducto($prediccion, $filtros),
            'nivel_riesgo_stock' => $this->enumValue($prediccion->nivel_riesgo_stock),
            'nivel_recomendacion' => $this->enumValue($prediccion->nivel_recomendacion),
            'nivel_confianza' => $this->enumValue($prediccion->nivel_confianza),
            'rotacion_stock' => (float) $prediccion->rotacion_stock,
            'ratio_cobertura' => (float) $prediccion->ratio_cobertura,
            'tendencia_porcentual' => (float) $prediccion->tendencia_porcentual,
            'motivo' => $prediccion->motivo,
        ];
    }

    private function calcularEscenario(string $clave, array $escenario, Collection $productos, ConclusionesInteligenciaVentasData $filtros): array
    {
        $detalle = $productos->map(function (array $producto) use ($escenario): array {
            $cantidad = $this->cantidadEscenario($producto['cantidad_recomendada'], $escenario['factor']);
            $costo = $cantidad * $producto['costo_unitario'];
            $ingreso = $cantidad * $producto['precio_venta'];

            return [
                ...$producto,
                'cantidad_escenario' => $cantidad,
                'costo_inversion' => round($costo, 2),
                'ingreso_estimado' => round($ingreso, 2),
                'ganancia_estimada' => round($ingreso - $costo, 2),
            ];
        })->filter(fn (array $producto) => $producto['cantidad_escenario'] > 0)->values();

        if ($detalle->isEmpty()) {
            return $this->escenarioVacio($clave, $escenario);
        }

        $costo = (float) $detalle->sum('costo_inversion');
        $ingreso = (float) $detalle->sum('ingreso_estimado');
        $ganancia = $ingreso - $costo;

        return [
            'clave' => $clave,
            'nombre' => $escenario['nombre'],
            'factor' => $escenario['factor'],
            'unidades_sugeridas' => (int) $detalle->sum('cantidad_escenario'),
            'costo_inversion' => round($costo, 2),
            'ingreso_estimado' => round($ingreso, 2),
            'ganancia_estimada' => round($ganancia, 2),
            'margen_estimado' => $ingreso > 0 ? round($ganancia / $ingreso, 4) : 0,
            'roi_estimado' => $costo > 0 ? round($ganancia / $costo, 4) : 0,
            'riesgo' => $this->riesgoEscenario($clave, $detalle, $filtros),
            'categorias_incluidas' => $detalle->pluck('categoria')->unique()->values(),
            'productos_principales' => $detalle->sortByDesc('ganancia_estimada')->take(4)->pluck('producto')->values(),
            'motivo_resumido' => $escenario['motivo'],
        ];
    }

    private function categorias(Collection $productos): Collection
    {
        return $productos->filter(fn (array $producto) => $producto['cantidad_recomendada'] > 0)
            ->groupBy('categoria')
            ->map(function (Collection $items, string $categoria): array {
                return [
                    'categoria' => $categoria,
                    'unidades_sugeridas' => (int) $items->sum('cantidad_recomendada'),
                    'inversion_aproximada' => round((float) $items->sum('costo_estimado_total'), 2),
                    'ganancia_estimada' => round((float) $items->sum('ganancia_estimada'), 2),
                    'prioridad' => $items->contains(fn (array $item) => $item['nivel_recomendacion'] === 'alta') ? 'Alta prioridad' : 'Prioridad media',
                    'motivo' => 'Concentra productos con proyeccion favorable, cobertura limitada y oportunidad de margen.',
                ];
            })
            ->sortByDesc('ganancia_estimada')
            ->values();
    }

    private function noAbastecer(Collection $items): Collection
    {
        return $items->filter(fn (PrediccionVenta $item) => $this->enumValue($item->nivel_recomendacion) === 'no_abastecer' || (int) $item->cantidad_sugerida_abastecimiento === 0)
            ->map(fn (PrediccionVenta $item): array => [
                'producto' => $item->producto?->nombre_pro ?? $item->codigo_prediccion,
                'categoria' => $item->categoria?->nombre_cat ?? '-',
                'stock_actual' => (int) $item->stock_actual,
                'proyeccion' => (int) $item->ventas_estimadas_proximo_periodo,
                'rotacion_stock' => (float) $item->rotacion_stock,
                'motivo' => 'La cobertura actual y la proyeccion disponible no justifican nueva inversion en este momento.',
            ])
            ->values();
    }

    private function factorPeriodo(PrediccionVenta $prediccion, ConclusionesInteligenciaVentasData $filtros, $configuracion): float
    {
        $meses = $filtros->tipoAnalisis === 'temporada' ? 3 : $filtros->horizonteMeses;
        $tendencia = 1 + (((float) $prediccion->tendencia_porcentual) / 100);
        $tendencia = min((float) $configuracion->limite_factor_tendencia_max, max((float) $configuracion->limite_factor_tendencia_min, $tendencia));

        return max(0, min(6, $meses * $tendencia));
    }

    private function filtrarPorTemporada(Collection $items, string $temporada): Collection
    {
        $terminos = self::TEMPORADAS[$temporada] ?? [];

        return $items->filter(function (PrediccionVenta $item) use ($terminos): bool {
            $texto = mb_strtolower(($item->categoria?->nombre_cat ?? '').' '.($item->producto?->nombre_pro ?? ''));

            foreach ($terminos as $termino) {
                if (str_contains($texto, $termino)) {
                    return true;
                }
            }

            return false;
        })->values();
    }

    private function temporada(ConclusionesInteligenciaVentasData $filtros, bool $coincidenciaTemporada, Collection $categorias, Collection $productos): ?array
    {
        if ($filtros->tipoAnalisis !== 'temporada') {
            return null;
        }

        return [
            'nombre' => ucfirst($filtros->temporada),
            'coincidencia_directa' => $coincidenciaTemporada,
            'mensaje' => $coincidenciaTemporada
                ? 'Se priorizan productos y categorias con relacion directa a la temporada seleccionada.'
                : 'No se encontraron coincidencias directas de temporada; se muestran las mejores proyecciones reales disponibles.',
            'categorias_prioritarias' => $categorias->take(4)->pluck('categoria')->values(),
            'productos_principales' => $productos->filter(fn (array $producto) => $producto['cantidad_recomendada'] > 0)->take(5)->pluck('producto')->values(),
        ];
    }

    private function conclusionGeneral(Collection $productos, Collection $categorias, array $recomendado, ConclusionesInteligenciaVentasData $filtros): string
    {
        if ($productos->isEmpty() || (int) $recomendado['unidades_sugeridas'] === 0) {
            return 'Para el periodo seleccionado no se detecta una necesidad significativa de abastecimiento. Conviene preservar liquidez y revisar productos con baja rotacion antes de comprar nueva mercaderia.';
        }

        $categoriasTexto = $categorias->take(2)->pluck('categoria')->implode(' y ') ?: 'las categorias con mejor proyeccion';
        $alcance = $filtros->tipoAnalisis === 'temporada'
            ? 'la temporada seleccionada'
            : "los proximos {$filtros->horizonteMeses} mes(es)";

        return "Para {$alcance} se recomienda priorizar {$categoriasTexto}, especialmente productos con alta rotacion, stock insuficiente y margen estimado favorable. La decision concentra la inversion en productos con mejor oportunidad comercial y riesgo {$recomendado['riesgo']}.";
    }

    private function canalRelevante(Collection $productos): string
    {
        return $productos->groupBy('canal')
            ->sortByDesc(fn (Collection $items) => $items->sum('ingreso_estimado'))
            ->keys()
            ->first() ?? '-';
    }

    private function precioVenta(PrediccionVenta $prediccion): float
    {
        $precioVariante = (float) ($prediccion->variante?->precio_venta_variante ?? 0);
        if ($precioVariante > 0) {
            return $precioVariante;
        }

        return (float) ($prediccion->producto?->precio_venta_pro ?? $prediccion->precio_promedio_venta ?? 0);
    }

    private function costoUnitario(PrediccionVenta $prediccion, float $precioVenta): array
    {
        $costo = (float) ($prediccion->producto?->precio_costo_pro ?? 0);

        if ($costo > 0) {
            return [$costo, false];
        }

        return [round($precioVenta * 0.60, 2), true];
    }

    private function cantidadEscenario(int $cantidad, float $factor): int
    {
        return $cantidad > 0 ? max(0, (int) round($cantidad * $factor)) : 0;
    }

    private function riesgoProducto(PrediccionVenta $prediccion, ConclusionesInteligenciaVentasData $filtros): string
    {
        $puntaje = $this->puntajeRiesgo($prediccion, $filtros, 'recomendado');

        return $this->riesgoDesdePuntaje($puntaje);
    }

    private function riesgoEscenario(string $clave, Collection $productos, ConclusionesInteligenciaVentasData $filtros): string
    {
        $puntaje = match ($clave) {
            'conservador' => -0.4,
            'agresivo' => 0.8,
            default => 0.2,
        };

        $puntaje += $filtros->tipoAnalisis === 'meses' && $filtros->horizonteMeses >= 3 ? 0.4 : 0;
        $puntaje += $productos->avg(function (array $producto): float {
            $score = 0.0;
            $score += $producto['nivel_confianza'] === 'baja' ? 1.2 : ($producto['nivel_confianza'] === 'media' ? 0.5 : -0.4);
            $score += $producto['nivel_recomendacion'] === 'alta' ? -0.3 : 0.3;
            $score += $producto['rotacion_stock'] >= 1 ? -0.3 : 0.4;
            $score += $producto['tendencia_porcentual'] < 0 ? 0.5 : -0.2;

            return $score;
        }) ?? 0;

        return $this->riesgoDesdePuntaje($puntaje);
    }

    private function puntajeRiesgo(PrediccionVenta $prediccion, ConclusionesInteligenciaVentasData $filtros, string $escenario): float
    {
        $puntaje = $escenario === 'agresivo' ? 0.8 : ($escenario === 'conservador' ? -0.3 : 0.2);
        $puntaje += $this->enumValue($prediccion->nivel_confianza) === 'baja' ? 1.0 : ($this->enumValue($prediccion->nivel_confianza) === 'media' ? 0.4 : -0.4);
        $puntaje += (float) $prediccion->rotacion_stock >= 1 ? -0.3 : 0.4;
        $puntaje += (float) $prediccion->tendencia_porcentual < 0 ? 0.5 : -0.2;
        $puntaje += $filtros->tipoAnalisis === 'meses' && $filtros->horizonteMeses >= 3 ? 0.3 : 0;

        return $puntaje;
    }

    private function riesgoDesdePuntaje(float $puntaje): string
    {
        return match (true) {
            $puntaje <= 0.4 => 'Bajo',
            $puntaje <= 1.5 => 'Medio',
            default => 'Alto',
        };
    }

    private function escenarioVacio(string $clave, array $escenario): array
    {
        return [
            'clave' => $clave,
            'nombre' => $escenario['nombre'],
            'factor' => $escenario['factor'],
            'unidades_sugeridas' => 0,
            'costo_inversion' => 0,
            'ingreso_estimado' => 0,
            'ganancia_estimada' => 0,
            'margen_estimado' => 0,
            'roi_estimado' => 0,
            'riesgo' => 'Bajo',
            'categorias_incluidas' => [],
            'productos_principales' => [],
            'motivo_resumido' => $escenario['motivo'],
        ];
    }

    private function enumValue($value): string
    {
        return $value instanceof \BackedEnum ? (string) $value->value : (string) $value;
    }
}
