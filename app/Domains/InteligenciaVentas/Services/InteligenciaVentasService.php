<?php

namespace App\Domains\InteligenciaVentas\Services;

use App\Domains\InteligenciaVentas\Enums\EstadoDemandaEnum;
use App\Domains\InteligenciaVentas\Repositories\ConfiguracionInteligenciaVentasRepository;
use App\Domains\InteligenciaVentas\Repositories\InventarioAnaliticaRepository;
use App\Domains\InteligenciaVentas\Repositories\PrediccionVentasRepository;
use App\Domains\InteligenciaVentas\Repositories\VentasHistoricasRepository;
use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class InteligenciaVentasService
{
    public function __construct(
        private readonly ConfiguracionInteligenciaVentasRepository $configuraciones,
        private readonly VentasHistoricasRepository $ventasHistoricas,
        private readonly PrediccionVentasRepository $predicciones,
        private readonly InventarioAnaliticaRepository $inventario,
        private readonly MetricasVentasService $metricasVentas,
        private readonly MetricasRelativasService $metricasRelativas,
        private readonly ClasificadorDemandaRelativaService $clasificador,
        private readonly MatrizTransicionDemandaService $matrizTransicion,
        private readonly PrediccionDemandaService $prediccionDemanda,
        private readonly RecomendacionAbastecimientoService $recomendacion,
        private readonly CanalDominanteService $canalDominante,
        private readonly ExplicacionPrediccionVentasService $explicacion,
    ) {}

    public function generar(array $parametros = []): Collection
    {
        $configuracion = $this->configuraciones->activa();
        $diasAnalisis = (int) ($parametros['dias_analisis'] ?? $configuracion->dias_analisis);
        $hasta = isset($parametros['periodo_fin']) ? Carbon::parse($parametros['periodo_fin'])->endOfDay() : now()->endOfDay();
        $desde = isset($parametros['periodo_inicio']) ? Carbon::parse($parametros['periodo_inicio'])->startOfDay() : $hasta->copy()->subDays($diasAnalisis - 1)->startOfDay();
        $historicoDesde = $desde->copy()->subDays($diasAnalisis * 2)->startOfDay();

        $ventas = $this->ventasHistoricas->ventasPorProducto($historicoDesde, $hasta)
            ->map(function (array $venta): array {
                $venta['fecha_carbon'] = Carbon::parse($venta['fecha']);
                $venta['cantidad'] = (int) $venta['cantidad'];
                $venta['subtotal'] = (float) $venta['subtotal'];

                return $venta;
            });

        $this->predicciones->limpiar();

        $productos = Producto::with('categoria')->whereIn('cod_producto', $ventas->pluck('cod_producto')->unique())->get();
        $ventasPorCategoria = $ventas->whereBetween('fecha_carbon', [$desde, $hasta])->groupBy('cod_categoria_producto');
        $ventasPeriodoPorProducto = $ventas->whereBetween('fecha_carbon', [$desde, $hasta])->groupBy('cod_producto');

        return DB::transaction(function () use ($productos, $ventas, $ventasPorCategoria, $ventasPeriodoPorProducto, $desde, $hasta, $configuracion, $diasAnalisis, $parametros): Collection {
            return $productos->map(function (Producto $producto) use ($ventas, $ventasPorCategoria, $ventasPeriodoPorProducto, $desde, $hasta, $configuracion, $diasAnalisis, $parametros) {
                $ventasProducto = $ventas->where('cod_producto', $producto->cod_producto)->values();
                $ventasProductoPeriodo = $ventasPeriodoPorProducto->get($producto->cod_producto, collect());
                $ventasCategoriaPeriodo = $ventasPorCategoria->get($producto->cod_categoria_producto, collect());

                $ventasPeriodo = (int) $ventasProductoPeriodo->sum('cantidad');
                $ventasCategoria = (int) $ventasCategoriaPeriodo->sum('cantidad');
                $productosEnCategoria = max(1, $ventasCategoriaPeriodo->pluck('cod_producto')->unique()->count());
                $promedioCategoria = $ventasCategoria / $productosEnCategoria;
                $promedioHistoricoProducto = $this->promedioPorPeriodos($ventasProducto, $diasAnalisis);
                $promedioVentasPeriodo = max($promedioHistoricoProducto, $ventasPeriodo);

                $indiceRelativo = $this->metricasRelativas->dividir($ventasPeriodo, $promedioCategoria);
                $estadoActual = $this->clasificador->clasificar($indiceRelativo, $configuracion);
                $estadosHistoricos = $this->estadosHistoricos($ventasProducto, $ventasCategoriaPeriodo, $configuracion, $hasta);
                $matriz = $this->matrizTransicion->calcular($estadosHistoricos, $estadoActual);
                $estadoPredicho = EstadoDemandaEnum::from($matriz->estadoPredicho);

                $ventas30 = $this->metricasVentas->ventasEnDias($ventasProducto, $hasta, 30);
                $ventas60 = $this->metricasVentas->ventasEnDias($ventasProducto, $hasta, 60);
                $ventas90 = $this->metricasVentas->ventasEnDias($ventasProducto, $hasta, 90);
                $anteriores = $this->metricasVentas->ventasEntre($ventasProducto, $hasta->copy()->subDays(59)->startOfDay(), $hasta->copy()->subDays(30)->endOfDay());
                $tendencia = $this->metricasVentas->tendencia($ventas30, $anteriores);
                $proyeccion = $this->prediccionDemanda->estimar($promedioVentasPeriodo, $tendencia, $estadoPredicho, $configuracion);
                $stockActual = $this->inventario->stockTotalProducto($producto->cod_producto);
                $recomendacion = $this->recomendacion->calcular($ventasPeriodo, $proyeccion['ventas_estimadas_proximo_periodo'], $stockActual, $estadoPredicho, $configuracion);
                $canal = $this->canalDominante->calcular($ventasProductoPeriodo);
                $precioPromedio = $this->metricasVentas->precioPromedio($ventasProducto);

                $data = [
                    'codigo_prediccion' => $this->generarCodigo($producto->cod_producto),
                    'periodo_inicio' => $desde->toDateString(),
                    'periodo_fin' => $hasta->toDateString(),
                    'tipo_periodo' => $configuracion->periodo_agrupacion,
                    'cod_categoria_producto' => $producto->cod_categoria_producto,
                    'cod_producto' => $producto->cod_producto,
                    'cod_variante_producto' => null,
                    'cod_talla_producto' => null,
                    'cod_canal_venta' => $canal['cod_canal_venta'],
                    'estado_demanda_actual' => $estadoActual->value,
                    'estado_demanda_predicho' => $estadoPredicho->value,
                    'probabilidad_baja' => $matriz->probabilidades['baja'] ?? 0,
                    'probabilidad_media' => $matriz->probabilidades['media'] ?? 0,
                    'probabilidad_alta' => $matriz->probabilidades['alta'] ?? 0,
                    'ventas_ultimos_30_dias' => $ventas30,
                    'ventas_ultimos_60_dias' => $ventas60,
                    'ventas_ultimos_90_dias' => $ventas90,
                    'ventas_periodo' => $ventasPeriodo,
                    'promedio_ventas_periodo' => round($promedioVentasPeriodo, 2),
                    'tendencia_porcentual' => $tendencia,
                    'indice_demanda_relativa' => $indiceRelativo,
                    'participacion_categoria' => $this->metricasRelativas->dividir($ventasPeriodo, $ventasCategoria),
                    'participacion_canal' => $canal['participacion_canal'],
                    'variacion_vs_promedio_historico' => $this->metricasRelativas->variacion($ventasPeriodo, $promedioHistoricoProducto),
                    'variacion_vs_promedio_categoria' => $this->metricasRelativas->variacion($ventasPeriodo, $promedioCategoria),
                    'rotacion_stock' => $recomendacion->rotacionStock,
                    'ratio_cobertura' => $recomendacion->ratioCobertura,
                    'ventas_estimadas_proximo_periodo' => $proyeccion['ventas_estimadas_proximo_periodo'],
                    'rango_estimado_minimo' => $proyeccion['rango_estimado_minimo'],
                    'rango_estimado_maximo' => $proyeccion['rango_estimado_maximo'],
                    'stock_actual' => $stockActual,
                    'porcentaje_stock_seguridad' => $configuracion->porcentaje_stock_seguridad,
                    'stock_seguridad_dinamico' => $recomendacion->stockSeguridadDinamico,
                    'cantidad_sugerida_abastecimiento' => $recomendacion->cantidadSugerida,
                    'precio_promedio_venta' => $precioPromedio,
                    'ingreso_estimado' => round($proyeccion['ventas_estimadas_proximo_periodo'] * $precioPromedio, 2),
                    'canal_dominante' => $canal['canal_dominante'],
                    'porcentaje_canal_dominante' => $canal['porcentaje_canal_dominante'],
                    'nivel_riesgo_stock' => $recomendacion->nivelRiesgoStock,
                    'nivel_recomendacion' => $recomendacion->nivelRecomendacion,
                    'nivel_confianza' => $matriz->nivelConfianza,
                    'puntaje' => $this->puntaje($indiceRelativo, $recomendacion->rotacionStock, $recomendacion->ratioCobertura, $canal['participacion_canal']),
                    'parametros' => ['matriz' => $matriz->matriz, 'periodos_historicos' => $matriz->periodosHistoricos, 'entrada' => $parametros],
                ];

                $data['motivo'] = $this->explicacion->construir($producto, $data);

                return $this->predicciones->crear($data);
            })->values();
        });
    }

    private function promedioPorPeriodos(Collection $ventasProducto, int $diasAnalisis): float
    {
        $periodos = max(1, (int) ceil(max(1, $diasAnalisis) / 30));

        return round((float) $ventasProducto->sum('cantidad') / $periodos, 2);
    }

    private function estadosHistoricos(Collection $ventasProducto, Collection $ventasCategoriaPeriodo, $configuracion, Carbon $hasta): array
    {
        $estados = [];
        for ($i = 3; $i >= 0; $i--) {
            $inicio = $hasta->copy()->subDays(($i + 1) * 30 - 1)->startOfDay();
            $fin = $hasta->copy()->subDays($i * 30)->endOfDay();
            $ventasProductoPeriodo = $ventasProducto->filter(fn (array $venta) => $venta['fecha_carbon']->betweenIncluded($inicio, $fin))->sum('cantidad');
            $ventasCategoria = $ventasCategoriaPeriodo->filter(fn (array $venta) => $venta['fecha_carbon']->betweenIncluded($inicio, $fin));
            $promedioCategoria = max(1, $ventasCategoria->sum('cantidad') / max(1, $ventasCategoria->pluck('cod_producto')->unique()->count()));
            $estados[] = $this->clasificador->clasificar($this->metricasRelativas->dividir($ventasProductoPeriodo, $promedioCategoria), $configuracion);
        }

        return $estados;
    }

    private function puntaje(float $indiceRelativo, float $rotacion, float $cobertura, float $participacionCanal): float
    {
        return round(($indiceRelativo * 35) + (min($rotacion, 5) * 20) + ((1 / max($cobertura, 0.10)) * 20) + ($participacionCanal * 25), 4);
    }

    private function generarCodigo(int $codProducto): string
    {
        return 'IV-'.now()->format('YmdHis').'-'.$codProducto;
    }
}
