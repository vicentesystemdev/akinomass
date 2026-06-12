<?php

namespace App\Domains\InteligenciaVentas\Repositories;

use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class VentasHistoricasRepository
{
    public function ventasPorProducto(CarbonInterface $desde, CarbonInterface $hasta): Collection
    {
        $pedidos = DB::table('detalles_pedido as dp')
            ->join('pedidos as p', 'p.cod_pedido', '=', 'dp.cod_pedido')
            ->join('productos as pr', 'pr.cod_producto', '=', 'dp.cod_producto')
            ->leftJoin('variantes_producto as vp', 'vp.cod_variante_producto', '=', 'dp.cod_variante_producto')
            ->whereBetween('p.fecha_pedido_ped', [$desde->toDateString(), $hasta->toDateString()])
            ->where('p.estado_ped', '!=', EstadoPedidoEnum::CANCELADO->value)
            ->selectRaw('p.fecha_pedido_ped as fecha, pr.cod_categoria_producto, dp.cod_producto, dp.cod_variante_producto, vp.cod_talla_producto, p.cod_canal_venta, SUM(dp.cantidad_det) as cantidad, SUM(dp.subtotal_det) as subtotal')
            ->groupBy('p.fecha_pedido_ped', 'pr.cod_categoria_producto', 'dp.cod_producto', 'dp.cod_variante_producto', 'vp.cod_talla_producto', 'p.cod_canal_venta')
            ->get();

        $ventasRedes = collect();
        if (DB::getSchemaBuilder()->hasTable('ventas_redes')) {
            $ventasRedes = DB::table('venta_red_detalles as vrd')
                ->join('ventas_redes as vr', 'vr.cod_venta_red', '=', 'vrd.cod_venta_red')
                ->join('productos as pr', 'pr.cod_producto', '=', 'vrd.cod_producto')
                ->leftJoin('variantes_producto as vp', 'vp.cod_variante_producto', '=', 'vrd.cod_variante_producto')
                ->whereNull('vr.cod_pedido')
                ->whereIn('vr.estado_venta_red', ['confirmada', 'convertida_checkout'])
                ->whereBetween(DB::raw('DATE(vr.created_at)'), [$desde->toDateString(), $hasta->toDateString()])
                ->selectRaw('DATE(vr.created_at) as fecha, pr.cod_categoria_producto, vrd.cod_producto, vrd.cod_variante_producto, COALESCE(vrd.cod_talla_producto, vp.cod_talla_producto) as cod_talla_producto, vr.cod_canal_venta, SUM(vrd.cantidad) as cantidad, SUM(vrd.subtotal) as subtotal')
                ->groupBy(DB::raw('DATE(vr.created_at)'), 'pr.cod_categoria_producto', 'vrd.cod_producto', 'vrd.cod_variante_producto', DB::raw('COALESCE(vrd.cod_talla_producto, vp.cod_talla_producto)'), 'vr.cod_canal_venta')
                ->get();
        }

        return $pedidos->concat($ventasRedes)->map(fn ($row) => (array) $row)->values();
    }
}
