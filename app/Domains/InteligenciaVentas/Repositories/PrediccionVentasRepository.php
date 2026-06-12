<?php

namespace App\Domains\InteligenciaVentas\Repositories;

use App\Domains\InteligenciaVentas\DTOs\FiltroInteligenciaVentasData;
use App\Models\PrediccionVenta;
use Illuminate\Support\Collection;

class PrediccionVentasRepository
{
    public function crear(array $data): PrediccionVenta
    {
        return PrediccionVenta::create($data);
    }

    public function limpiar(): int
    {
        return PrediccionVenta::query()->delete();
    }

    public function listar(FiltroInteligenciaVentasData $filtros): Collection
    {
        return PrediccionVenta::with(['categoria', 'producto', 'variante.talla', 'canalVenta'])
            ->when($filtros->codCategoriaProducto, fn ($query) => $query->where('cod_categoria_producto', $filtros->codCategoriaProducto))
            ->when($filtros->codProducto, fn ($query) => $query->where('cod_producto', $filtros->codProducto))
            ->when($filtros->codCanalVenta, fn ($query) => $query->where('cod_canal_venta', $filtros->codCanalVenta))
            ->when($filtros->nivelRecomendacion, fn ($query) => $query->where('nivel_recomendacion', $filtros->nivelRecomendacion))
            ->when($filtros->nivelRiesgoStock, fn ($query) => $query->where('nivel_riesgo_stock', $filtros->nivelRiesgoStock))
            ->when($filtros->periodoInicio, fn ($query) => $query->whereDate('periodo_inicio', '>=', $filtros->periodoInicio))
            ->when($filtros->periodoFin, fn ($query) => $query->whereDate('periodo_fin', '<=', $filtros->periodoFin))
            ->latest('puntaje')
            ->get();
    }

    public function productos(): Collection
    {
        return $this->listar(new FiltroInteligenciaVentasData())->whereNotNull('cod_producto')->values();
    }

    public function categorias(): Collection
    {
        return $this->listar(new FiltroInteligenciaVentasData())->groupBy('cod_categoria_producto')->map(function ($items) {
            $first = $items->first();
            $canalDominante = $items->filter(fn ($item) => $item->canal_dominante)
                ->sortByDesc('porcentaje_canal_dominante')
                ->first()?->canal_dominante;
            $principal = $items->sortByDesc('puntaje')->first();

            return [
                'cod_categoria_producto' => $first->cod_categoria_producto,
                'categoria' => $first->categoria,
                'ventas_ultimos_30_dias' => $items->sum('ventas_ultimos_30_dias'),
                'ventas_ultimos_90_dias' => $items->sum('ventas_ultimos_90_dias'),
                'ventas_estimadas' => $items->sum('ventas_estimadas_proximo_periodo'),
                'indice_demanda' => round((float) $items->avg('indice_demanda_relativa'), 4),
                'estado_proyectado' => $principal?->estado_demanda_predicho,
                'probabilidad_alta' => round((float) $items->avg('probabilidad_alta'), 4),
                'stock_total' => $items->sum('stock_actual'),
                'productos_riesgo' => $items->whereIn('nivel_riesgo_stock', ['alto', 'medio'])->count(),
                'cantidad_sugerida' => $items->sum('cantidad_sugerida_abastecimiento'),
                'ingreso_estimado' => $items->sum('ingreso_estimado'),
                'canal_dominante' => $canalDominante,
                'motivo' => $principal?->motivo,
                'predicciones' => $items->values(),
            ];
        })->values();
    }

    public function recomendaciones(): Collection
    {
        return PrediccionVenta::with(['producto', 'categoria', 'canalVenta'])
            ->where('cantidad_sugerida_abastecimiento', '>', 0)
            ->orderByRaw("CASE nivel_recomendacion WHEN 'alta' THEN 1 WHEN 'media' THEN 2 WHEN 'baja' THEN 3 ELSE 4 END")
            ->orderByDesc('puntaje')
            ->get();
    }

    public function conclusiones(array $filtros = []): Collection
    {
        return PrediccionVenta::with(['categoria', 'producto', 'variante.talla', 'canalVenta'])
            ->when($filtros['cod_categoria_producto'] ?? null, fn ($query, $categoria) => $query->where('cod_categoria_producto', $categoria))
            ->when($filtros['cod_canal_venta'] ?? null, fn ($query, $canal) => $query->where('cod_canal_venta', $canal))
            ->when($filtros['nivel_recomendacion'] ?? null, fn ($query, $nivel) => $query->where('nivel_recomendacion', $nivel))
            ->when($filtros['nivel_riesgo_stock'] ?? null, fn ($query, $nivel) => $query->where('nivel_riesgo_stock', $nivel))
            ->orderByRaw("CASE nivel_recomendacion WHEN 'alta' THEN 1 WHEN 'media' THEN 2 WHEN 'baja' THEN 3 ELSE 4 END")
            ->orderByDesc('puntaje')
            ->get();
    }
}
