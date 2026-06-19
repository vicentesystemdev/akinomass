<?php

declare(strict_types=1);

namespace App\Domains\InteligenciaVentas\Repositories;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\InteligenciaVentas\DTOs\FiltroTendenciaVentasData;
use App\Models\CanalVenta;
use App\Models\CategoriaProducto;
use App\Models\Producto;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class TendenciaVentasRepository
{
    public function series(FiltroTendenciaVentasData $filtro): Collection
    {
        $hasta = $filtro->periodoFin ? Carbon::parse($filtro->periodoFin)->endOfDay() : now()->endOfMonth();
        $desde = $filtro->periodoInicio
            ? Carbon::parse($filtro->periodoInicio)->startOfDay()
            : ($filtro->periodicidad === 'semanal'
                ? $hasta->copy()->subWeeks(11)->startOfWeek()
                : $hasta->copy()->subMonths(11)->startOfMonth());

        $ventas = DB::table('detalles_pedido as dp')
            ->join('pedidos as p', 'p.cod_pedido', '=', 'dp.cod_pedido')
            ->join('productos as pr', 'pr.cod_producto', '=', 'dp.cod_producto')
            ->whereBetween('p.fecha_pedido_ped', [$desde->toDateString(), $hasta->toDateString()])
            ->whereIn('p.estado_ped', $this->estadosValidos())
            ->whereExists(function ($query): void {
                $query->selectRaw('1')
                    ->from('pagos as pa')
                    ->whereColumn('pa.cod_pedido', 'p.cod_pedido')
                    ->where('pa.estado_pago_pag', EstadoPagoEnum::PAGADO->value);
            })
            ->when($filtro->codCategoriaProducto, fn ($query, $id) => $query->where('pr.cod_categoria_producto', $id))
            ->when($filtro->codProducto, fn ($query, $id) => $query->where('dp.cod_producto', $id))
            ->when($filtro->codCanalVenta, fn ($query, $id) => $query->where('p.cod_canal_venta', $id))
            ->selectRaw('p.fecha_pedido_ped AS fecha, SUM(dp.cantidad_det) AS cantidad, SUM(dp.subtotal_det) AS monto')
            ->groupBy('p.fecha_pedido_ped')
            ->orderBy('p.fecha_pedido_ped')
            ->get()
            ->map(fn (object $item): array => [
                'fecha' => Carbon::parse($item->fecha),
                'cantidad' => (float) $item->cantidad,
                'monto' => (float) $item->monto,
            ]);

        $agrupadas = $ventas->groupBy(
            fn (array $item): string => $this->clavePeriodo($item['fecha'], $filtro->periodicidad),
        );

        return $this->periodosCompletos($desde, $hasta, $filtro->periodicidad)->map(
            function (Carbon $periodo) use ($agrupadas, $filtro): array {
                $clave = $this->clavePeriodo($periodo, $filtro->periodicidad);
                $items = $agrupadas->get($clave, collect());

                return [
                    'periodo' => $clave,
                    'etiqueta' => $this->etiquetaPeriodo($periodo, $filtro->periodicidad),
                    'valor' => round((float) $items->sum($filtro->metrica), 2),
                ];
            },
        )->values();
    }

    public function opciones(): array
    {
        return [
            'categorias' => CategoriaProducto::query()
                ->where('activo_cat', true)
                ->orderBy('nombre_cat')
                ->get(['cod_categoria_producto', 'nombre_cat']),
            'productos' => Producto::query()
                ->where('estado_pro', '!=', 'descontinuado')
                ->where('sku_pro', 'not like', 'GEN-CAT-%')
                ->orderBy('nombre_pro')
                ->get(['cod_producto', 'cod_categoria_producto', 'nombre_pro']),
            'canales' => CanalVenta::query()
                ->where('activo_can', true)
                ->orderBy('nombre_can')
                ->get(['cod_canal_venta', 'nombre_can']),
        ];
    }

    private function periodosCompletos(Carbon $desde, Carbon $hasta, string $periodicidad): Collection
    {
        $inicio = $periodicidad === 'semanal' ? $desde->copy()->startOfWeek() : $desde->copy()->startOfMonth();
        $fin = $periodicidad === 'semanal' ? $hasta->copy()->startOfWeek() : $hasta->copy()->startOfMonth();
        $intervalo = $periodicidad === 'semanal' ? '1 week' : '1 month';

        return collect(CarbonPeriod::create($inicio, $intervalo, $fin))
            ->map(fn ($fecha): Carbon => Carbon::instance($fecha));
    }

    private function clavePeriodo(Carbon $fecha, string $periodicidad): string
    {
        return $periodicidad === 'semanal'
            ? $fecha->copy()->startOfWeek()->format('Y-m-d')
            : $fecha->format('Y-m');
    }

    private function etiquetaPeriodo(Carbon $fecha, string $periodicidad): string
    {
        return $periodicidad === 'semanal'
            ? 'Sem. '.$fecha->copy()->startOfWeek()->format('d/m/Y')
            : ucfirst($fecha->locale('es')->translatedFormat('M Y'));
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
