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

    public function totalLeads(): int
    {
        return DB::table('leads')->count();
    }

    public function leadsNuevos(): int
    {
        return DB::table('leads')
            ->where('estado_lea', EstadoLeadEnum::NUEVO->value)
            ->count();
    }

    public function leadsConvertidos(): int
    {
        return DB::table('leads')
            ->where('estado_lea', EstadoLeadEnum::CONVERTIDO->value)
            ->count();
    }

    public function totalProductos(): int
    {
        return DB::table('productos')->count();
    }

    public function productosActivos(): int
    {
        return DB::table('productos')
            ->where('estado_pro', EstadoProductoEnum::ACTIVO->value)
            ->count();
    }

    public function productosConStockBajo(): int
    {
        return DB::table('inventarios')
            ->whereColumn('stock_actual_inv', '<=', 'stock_minimo_inv')
            ->count();
    }

    public function totalPedidos(): int
    {
        return DB::table('pedidos')->count();
    }

    public function pedidosPorEstado(string $estado): int
    {
        return DB::table('pedidos')
            ->where('estado_ped', $estado)
            ->count();
    }

    public function totalPagos(): int
    {
        return DB::table('pagos')->count();
    }

    public function pagosPorEstado(string $estado): int
    {
        return DB::table('pagos')
            ->where('estado_pago_pag', $estado)
            ->count();
    }

    public function montoTotalPagado(): float
    {
        return (float) DB::table('pagos')
            ->where('estado_pago_pag', EstadoPagoEnum::PAGADO->value)
            ->sum('monto_pag');
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

    public function totalSesionesLive(): int
    {
        return DB::table('sesiones_live')->count();
    }

    public function sesionesLiveActivasOProgramadas(): int
    {
        return DB::table('sesiones_live')
            ->whereIn('estado_ses', [
                EstadoSesionLiveEnum::EN_VIVO->value,
                EstadoSesionLiveEnum::PROGRAMADA->value,
            ])
            ->count();
    }

    public function totalInteraccionesLive(): int
    {
        return DB::table('interacciones_live')->count();
    }
}
