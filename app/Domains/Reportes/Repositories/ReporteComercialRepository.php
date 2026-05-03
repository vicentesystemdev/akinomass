<?php

namespace App\Domains\Reportes\Repositories;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use Illuminate\Support\Facades\DB;

class ReporteComercialRepository
{
    public function ventasPorFecha(array $filtros): array
    {
        $query = DB::table('pagos as pa')
            ->join('pedidos as pe', 'pe.cod_pedido', '=', 'pa.cod_pedido')
            ->where('pa.estado_pago_pag', EstadoPagoEnum::PAGADO->value)
            ->selectRaw('DATE(pa.fecha_pago_pag) as fecha, SUM(pa.monto_pag) as monto_pagado')
            ->groupByRaw('DATE(pa.fecha_pago_pag)')
            ->orderBy('fecha');

        if (! empty($filtros['fecha_inicio'])) {
            $query->whereDate('pa.fecha_pago_pag', '>=', $filtros['fecha_inicio']);
        }

        if (! empty($filtros['fecha_fin'])) {
            $query->whereDate('pa.fecha_pago_pag', '<=', $filtros['fecha_fin']);
        }

        if (! empty($filtros['estado_pedido'])) {
            $query->where('pe.estado_ped', $filtros['estado_pedido']);
        }

        if (! empty($filtros['cod_canal_venta'])) {
            $query->where('pe.cod_canal_venta', $filtros['cod_canal_venta']);
        }

        if (! empty($filtros['cod_tipo_flujo_comercial'])) {
            $query->where('pe.cod_tipo_flujo_comercial', $filtros['cod_tipo_flujo_comercial']);
        }

        return $query->get()->map(fn ($item) => [
            'fecha' => $item->fecha,
            'monto_pagado' => (float) $item->monto_pagado,
        ])->all();
    }

    public function pedidosPorEstado(array $filtros): array
    {
        $query = DB::table('pedidos')
            ->selectRaw('estado_ped as estado, COUNT(*) as total')
            ->groupBy('estado_ped')
            ->orderByDesc('total');

        if (! empty($filtros['fecha_inicio'])) {
            $query->whereDate('fecha_pedido_ped', '>=', $filtros['fecha_inicio']);
        }

        if (! empty($filtros['fecha_fin'])) {
            $query->whereDate('fecha_pedido_ped', '<=', $filtros['fecha_fin']);
        }

        if (! empty($filtros['estado_pedido'])) {
            $query->where('estado_ped', $filtros['estado_pedido']);
        }

        return $query->get()->map(fn ($item) => ['estado' => $item->estado, 'total' => (int) $item->total])->all();
    }

    public function pagosPorEstado(array $filtros): array
    {
        $query = DB::table('pagos')
            ->selectRaw('estado_pago_pag as estado, COUNT(*) as total, SUM(monto_pag) as monto_total')
            ->groupBy('estado_pago_pag')
            ->orderByDesc('total');

        if (! empty($filtros['fecha_inicio'])) {
            $query->whereDate('fecha_pago_pag', '>=', $filtros['fecha_inicio']);
        }

        if (! empty($filtros['fecha_fin'])) {
            $query->whereDate('fecha_pago_pag', '<=', $filtros['fecha_fin']);
        }

        if (! empty($filtros['estado_pago'])) {
            $query->where('estado_pago_pag', $filtros['estado_pago']);
        }

        return $query->get()->map(fn ($item) => [
            'estado' => $item->estado,
            'total' => (int) $item->total,
            'monto_total' => (float) $item->monto_total,
        ])->all();
    }

    public function leadsPorEstado(array $filtros): array
    {
        $query = DB::table('leads')
            ->selectRaw('estado_lea as estado, COUNT(*) as total')
            ->groupBy('estado_lea')
            ->orderByDesc('total');

        if (! empty($filtros['estado_lead'])) {
            $query->where('estado_lea', $filtros['estado_lead']);
        }

        if (! empty($filtros['cod_canal_venta'])) {
            $query->where('cod_canal_venta', $filtros['cod_canal_venta']);
        }

        if (! empty($filtros['cod_tipo_flujo_comercial'])) {
            $query->where('cod_tipo_flujo_comercial', $filtros['cod_tipo_flujo_comercial']);
        }

        return $query->get()->map(fn ($item) => ['estado' => $item->estado, 'total' => (int) $item->total])->all();
    }

    public function ventasPorCanal(array $filtros): array
    {
        $query = DB::table('pedidos as p')
            ->leftJoin('canales_venta as c', 'c.cod_canal_venta', '=', 'p.cod_canal_venta')
            ->leftJoin('pagos as pa', function ($join): void {
                $join->on('pa.cod_pedido', '=', 'p.cod_pedido')
                    ->where('pa.estado_pago_pag', '=', EstadoPagoEnum::PAGADO->value);
            })
            ->selectRaw("COALESCE(c.nombre_can, 'Sin canal') as canal, COUNT(DISTINCT p.cod_pedido) as total_pedidos, COALESCE(SUM(pa.monto_pag), 0) as monto_pagado")
            ->groupBy('c.nombre_can')
            ->orderByDesc('monto_pagado');

        if (! empty($filtros['fecha_inicio'])) {
            $query->whereDate('p.fecha_pedido_ped', '>=', $filtros['fecha_inicio']);
        }

        if (! empty($filtros['fecha_fin'])) {
            $query->whereDate('p.fecha_pedido_ped', '<=', $filtros['fecha_fin']);
        }

        if (! empty($filtros['cod_canal_venta'])) {
            $query->where('p.cod_canal_venta', $filtros['cod_canal_venta']);
        }

        if (! empty($filtros['estado_pedido'])) {
            $query->where('p.estado_ped', $filtros['estado_pedido']);
        }

        return $query->get()->map(fn ($item) => [
            'canal' => $item->canal,
            'total_pedidos' => (int) $item->total_pedidos,
            'monto_pagado' => (float) $item->monto_pagado,
        ])->all();
    }

    public function ventasPorTipoFlujo(array $filtros): array
    {
        $query = DB::table('pedidos as p')
            ->leftJoin('tipos_flujo_comercial as t', 't.cod_tipo_flujo_comercial', '=', 'p.cod_tipo_flujo_comercial')
            ->leftJoin('pagos as pa', function ($join): void {
                $join->on('pa.cod_pedido', '=', 'p.cod_pedido')
                    ->where('pa.estado_pago_pag', '=', EstadoPagoEnum::PAGADO->value);
            })
            ->selectRaw("COALESCE(t.nombre_tip, 'Sin flujo') as flujo, COUNT(DISTINCT p.cod_pedido) as total_pedidos, COALESCE(SUM(pa.monto_pag), 0) as monto_pagado")
            ->groupBy('t.nombre_tip')
            ->orderByDesc('monto_pagado');

        if (! empty($filtros['fecha_inicio'])) {
            $query->whereDate('p.fecha_pedido_ped', '>=', $filtros['fecha_inicio']);
        }

        if (! empty($filtros['fecha_fin'])) {
            $query->whereDate('p.fecha_pedido_ped', '<=', $filtros['fecha_fin']);
        }

        if (! empty($filtros['cod_tipo_flujo_comercial'])) {
            $query->where('p.cod_tipo_flujo_comercial', $filtros['cod_tipo_flujo_comercial']);
        }

        if (! empty($filtros['estado_pedido'])) {
            $query->where('p.estado_ped', $filtros['estado_pedido']);
        }

        return $query->get()->map(fn ($item) => [
            'flujo' => $item->flujo,
            'total_pedidos' => (int) $item->total_pedidos,
            'monto_pagado' => (float) $item->monto_pagado,
        ])->all();
    }

    public function productosConStockBajo(): array
    {
        return DB::table('inventarios as i')
            ->join('productos as p', 'p.cod_producto', '=', 'i.cod_producto')
            ->whereColumn('i.stock_actual_inv', '<=', 'i.stock_minimo_inv')
            ->select('p.cod_producto', 'p.nombre_pro', 'i.stock_actual_inv', 'i.stock_minimo_inv')
            ->orderBy('i.stock_actual_inv')
            ->get()
            ->map(fn ($item) => [
                'cod_producto' => $item->cod_producto,
                'nombre_producto' => $item->nombre_pro,
                'stock_actual' => (int) $item->stock_actual_inv,
                'stock_minimo' => (int) $item->stock_minimo_inv,
            ])
            ->all();
    }

    public function productosMasVendidos(array $filtros): array
    {
        $query = DB::table('detalles_pedido as dp')
            ->join('productos as p', 'p.cod_producto', '=', 'dp.cod_producto')
            ->join('pedidos as pe', 'pe.cod_pedido', '=', 'dp.cod_pedido')
            ->selectRaw('dp.cod_producto, p.nombre_pro, SUM(dp.cantidad_det) as cantidad_vendida, SUM(dp.subtotal_det) as monto_vendido')
            ->groupBy('dp.cod_producto', 'p.nombre_pro')
            ->orderByDesc('cantidad_vendida')
            ->limit(10);

        if (! empty($filtros['fecha_inicio'])) {
            $query->whereDate('pe.fecha_pedido_ped', '>=', $filtros['fecha_inicio']);
        }

        if (! empty($filtros['fecha_fin'])) {
            $query->whereDate('pe.fecha_pedido_ped', '<=', $filtros['fecha_fin']);
        }

        if (! empty($filtros['estado_pedido'])) {
            $query->where('pe.estado_ped', $filtros['estado_pedido']);
        }

        if (! empty($filtros['cod_canal_venta'])) {
            $query->where('pe.cod_canal_venta', $filtros['cod_canal_venta']);
        }

        if (! empty($filtros['cod_tipo_flujo_comercial'])) {
            $query->where('pe.cod_tipo_flujo_comercial', $filtros['cod_tipo_flujo_comercial']);
        }

        return $query->get()->map(fn ($item) => [
            'cod_producto' => $item->cod_producto,
            'nombre_producto' => $item->nombre_pro,
            'cantidad_vendida' => (int) $item->cantidad_vendida,
            'monto_vendido' => (float) $item->monto_vendido,
        ])->all();
    }

    public function canalesVenta(): array
    {
        return DB::table('canales_venta')->select('cod_canal_venta', 'nombre_can')->orderBy('nombre_can')->get()->map(fn ($c) => [
            'cod_canal_venta' => $c->cod_canal_venta,
            'nombre_can' => $c->nombre_can,
        ])->all();
    }

    public function tiposFlujoComercial(): array
    {
        return DB::table('tipos_flujo_comercial')->select('cod_tipo_flujo_comercial', 'nombre_tip')->orderBy('nombre_tip')->get()->map(fn ($t) => [
            'cod_tipo_flujo_comercial' => $t->cod_tipo_flujo_comercial,
            'nombre_tip' => $t->nombre_tip,
        ])->all();
    }
}
