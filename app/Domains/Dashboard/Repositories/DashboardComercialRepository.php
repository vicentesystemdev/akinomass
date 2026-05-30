<?php

namespace App\Domains\Dashboard\Repositories;

use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use App\Domains\Comercial\LiveSales\Enums\EstadoSesionLiveEnum;
use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\CRM\Leads\Enums\EstadoLeadEnum;
use Illuminate\Support\Facades\DB;

class DashboardComercialRepository
{
    public function totalClientes(): int
    {
        return DB::table('clientes')->count();
    }

    public function getLeadsStats(): array
    {
        $row = DB::table('leads')
            ->selectRaw("
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE estado_lea = ?) as nuevos,
                COUNT(*) FILTER (WHERE estado_lea = ?) as convertidos
            ", [EstadoLeadEnum::NUEVO->value, EstadoLeadEnum::CONVERTIDO->value])
            ->first();

        return [
            'total' => (int) ($row->total ?? 0),
            'nuevos' => (int) ($row->nuevos ?? 0),
            'convertidos' => (int) ($row->convertidos ?? 0),
        ];
    }

    public function getProductosStats(): array
    {
        $total = DB::table('productos')->count();
        $activos = DB::table('productos')
            ->where('estado_pro', EstadoProductoEnum::ACTIVO->value)
            ->count();
        $stockBajo = DB::table('inventarios')
            ->whereColumn('stock_actual_inv', '<=', 'stock_minimo_inv')
            ->count();

        return [
            'total' => $total,
            'activos' => $activos,
            'stock_bajo' => $stockBajo,
        ];
    }

    public function getPedidosStats(): array
    {
        $row = DB::table('pedidos')
            ->selectRaw("
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE estado_ped = ?) as borrador,
                COUNT(*) FILTER (WHERE estado_ped = ?) as confirmado,
                COUNT(*) FILTER (WHERE estado_ped = ?) as cancelado
            ", [
                EstadoPedidoEnum::BORRADOR->value,
                EstadoPedidoEnum::CONFIRMADO->value,
                EstadoPedidoEnum::CANCELADO->value,
            ])
            ->first();

        return [
            'total' => (int) ($row->total ?? 0),
            'borrador' => (int) ($row->borrador ?? 0),
            'confirmado' => (int) ($row->confirmado ?? 0),
            'cancelado' => (int) ($row->cancelado ?? 0),
        ];
    }

    public function getPagosStats(): array
    {
        $row = DB::table('pagos')
            ->selectRaw("
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE estado_pago_pag = ?) as pendiente,
                COUNT(*) FILTER (WHERE estado_pago_pag = ?) as pagado,
                COALESCE(SUM(monto_pag) FILTER (WHERE estado_pago_pag = ?), 0) as monto_total_pagado
            ", [
                EstadoPagoEnum::PENDIENTE->value,
                EstadoPagoEnum::PAGADO->value,
                EstadoPagoEnum::PAGADO->value,
            ])
            ->first();

        return [
            'total' => (int) ($row->total ?? 0),
            'pendiente' => (int) ($row->pendiente ?? 0),
            'pagado' => (int) ($row->pagado ?? 0),
            'monto_total_pagado' => (float) ($row->monto_total_pagado ?? 0),
        ];
    }

    public function getLiveStats(): array
    {
        $sesiones = DB::table('sesiones_live')
            ->selectRaw("
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE estado_ses IN (?, ?)) as activas_programadas
            ", [EstadoSesionLiveEnum::EN_VIVO->value, EstadoSesionLiveEnum::PROGRAMADA->value])
            ->first();

        $interacciones = DB::table('interacciones_live')->count();

        return [
            'sesiones_totales' => (int) ($sesiones->total ?? 0),
            'sesiones_en_vivo_o_programadas' => (int) ($sesiones->activas_programadas ?? 0),
            'interacciones_totales' => $interacciones,
        ];
    }

    public function ventasPorCanal(): array
    {
        return DB::table('pedidos as p')
            ->leftJoin('canales_venta as c', 'c.cod_canal_venta', '=', 'p.cod_canal_venta')
            ->selectRaw("COALESCE(c.nombre_can, 'Sin canal') as etiqueta, COUNT(*) as total")
            ->groupBy('c.nombre_can')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($item) => ['etiqueta' => $item->etiqueta, 'total' => (int) $item->total])
            ->all();
    }

    public function ventasPorTipoFlujo(): array
    {
        return DB::table('pedidos as p')
            ->leftJoin('tipos_flujo_comercial as t', 't.cod_tipo_flujo_comercial', '=', 'p.cod_tipo_flujo_comercial')
            ->selectRaw("COALESCE(t.nombre_tip, 'Sin flujo') as etiqueta, COUNT(*) as total")
            ->groupBy('t.nombre_tip')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($item) => ['etiqueta' => $item->etiqueta, 'total' => (int) $item->total])
            ->all();
    }
}
