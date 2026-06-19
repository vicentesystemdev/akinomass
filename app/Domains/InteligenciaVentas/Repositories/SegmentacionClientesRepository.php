<?php

declare(strict_types=1);

namespace App\Domains\InteligenciaVentas\Repositories;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\InteligenciaVentas\DTOs\FiltroSegmentacionClientesData;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class SegmentacionClientesRepository
{
    public function metricas(FiltroSegmentacionClientesData $filtro): Collection
    {
        $clientes = DB::table('clientes')
            ->where('estado_cli', 'activo')
            ->orderBy('cod_cliente')
            ->get(['cod_cliente', 'nombre_cli']);

        $pedidos = DB::table('pedidos as p')
            ->whereIn('p.estado_ped', $this->estadosValidos())
            ->when($filtro->periodoInicio, fn ($query, $fecha) => $query->whereDate('p.fecha_pedido_ped', '>=', $fecha))
            ->when($filtro->periodoFin, fn ($query, $fecha) => $query->whereDate('p.fecha_pedido_ped', '<=', $fecha))
            ->select([
                'p.cod_pedido',
                'p.cod_cliente',
                'p.fecha_pedido_ped',
                'p.total_ped',
            ])
            ->selectRaw(
                'CASE WHEN EXISTS (
                    SELECT 1 FROM pagos pa
                    WHERE pa.cod_pedido = p.cod_pedido
                    AND pa.estado_pago_pag = ?
                ) THEN 1 ELSE 0 END AS pagado',
                [EstadoPagoEnum::PAGADO->value],
            )
            ->get();

        $productosDistintos = DB::table('detalles_pedido as dp')
            ->join('pedidos as p', 'p.cod_pedido', '=', 'dp.cod_pedido')
            ->whereIn('p.estado_ped', $this->estadosValidos())
            ->whereExists(function ($query): void {
                $query->selectRaw('1')
                    ->from('pagos as pa')
                    ->whereColumn('pa.cod_pedido', 'p.cod_pedido')
                    ->where('pa.estado_pago_pag', EstadoPagoEnum::PAGADO->value);
            })
            ->when($filtro->periodoInicio, fn ($query, $fecha) => $query->whereDate('p.fecha_pedido_ped', '>=', $fecha))
            ->when($filtro->periodoFin, fn ($query, $fecha) => $query->whereDate('p.fecha_pedido_ped', '<=', $fecha))
            ->distinct()
            ->get(['p.cod_cliente', 'dp.cod_producto'])
            ->groupBy('cod_cliente')
            ->map(fn (Collection $items): int => $items->pluck('cod_producto')->unique()->count());

        $pedidosPorCliente = $pedidos->groupBy('cod_cliente');

        return $clientes->map(function (object $cliente) use ($pedidosPorCliente, $productosDistintos): array {
            $pedidosCliente = $pedidosPorCliente->get($cliente->cod_cliente, collect());
            $pagados = $pedidosCliente->where('pagado', 1)->values();
            $cantidadPedidos = $pedidosCliente->count();
            $cantidadPagados = $pagados->count();
            $totalComprado = (float) $pagados->sum('total_ped');
            $ultimaCompra = $pagados->max('fecha_pedido_ped');
            $primeraCompra = $pagados->min('fecha_pedido_ped');
            $mesesActividad = $primeraCompra && $ultimaCompra
                ? max(1, Carbon::parse($primeraCompra)->diffInMonths(Carbon::parse($ultimaCompra)) + 1)
                : 1;

            return [
                'cliente_id' => (int) $cliente->cod_cliente,
                'nombre_cliente' => $cliente->nombre_cli,
                'cantidad_pedidos_confirmados' => $cantidadPedidos,
                'cantidad_pedidos_pagados' => $cantidadPagados,
                'monto_total_comprado' => round($totalComprado, 2),
                'ticket_promedio' => $cantidadPagados > 0 ? round($totalComprado / $cantidadPagados, 2) : 0.0,
                'ultima_compra' => $ultimaCompra,
                'dias_desde_ultima_compra' => $ultimaCompra
                    ? max(0, Carbon::parse($ultimaCompra)->startOfDay()->diffInDays(now()->startOfDay()))
                    : 365,
                'frecuencia_compra' => round($cantidadPagados / $mesesActividad, 4),
                'cantidad_productos_distintos' => (int) ($productosDistintos->get($cliente->cod_cliente, 0)),
                'porcentaje_pedidos_pagados' => $cantidadPedidos > 0 ? round(($cantidadPagados / $cantidadPedidos) * 100, 2) : 0.0,
            ];
        })->values();
    }

    private function estadosValidos(): array
    {
        return [
            EstadoPedidoEnum::CONFIRMADO->value,
            EstadoPedidoEnum::PREPARANDO->value,
            EstadoPedidoEnum::ENVIADO->value,
            EstadoPedidoEnum::ENTREGADO->value,
        ];
    }
}
