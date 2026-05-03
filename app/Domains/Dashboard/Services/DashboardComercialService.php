<?php

namespace App\Domains\Dashboard\Services;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\Dashboard\Repositories\DashboardComercialRepository;
use Illuminate\Support\Facades\Cache;

class DashboardComercialService
{
    public function __construct(
        private readonly DashboardComercialRepository $repository,
    ) {
    }

    public function obtenerMetricas(): array
    {
        return Cache::remember('dashboard:comercial:metricas', 300, function (): array {
            return [
                'clientes' => ['total' => $this->repository->totalClientes()],
                'leads' => [
                    'total' => $this->repository->totalLeads(),
                    'nuevos' => $this->repository->leadsNuevos(),
                    'convertidos' => $this->repository->leadsConvertidos(),
                ],
                'productos' => [
                    'total' => $this->repository->totalProductos(),
                    'activos' => $this->repository->productosActivos(),
                    'stock_bajo' => $this->repository->productosConStockBajo(),
                ],
                'pedidos' => [
                    'total' => $this->repository->totalPedidos(),
                    'borrador' => $this->repository->pedidosPorEstado(EstadoPedidoEnum::BORRADOR->value),
                    'confirmado' => $this->repository->pedidosPorEstado(EstadoPedidoEnum::CONFIRMADO->value),
                    'cancelado' => $this->repository->pedidosPorEstado(EstadoPedidoEnum::CANCELADO->value),
                ],
                'pagos' => [
                    'total' => $this->repository->totalPagos(),
                    'pendiente' => $this->repository->pagosPorEstado(EstadoPagoEnum::PENDIENTE->value),
                    'pagado' => $this->repository->pagosPorEstado(EstadoPagoEnum::PAGADO->value),
                    'monto_total_pagado' => $this->repository->montoTotalPagado(),
                ],
                'ventas_por_canal' => $this->repository->ventasPorCanal(),
                'ventas_por_tipo_flujo' => $this->repository->ventasPorTipoFlujo(),
                'live_sales' => [
                    'sesiones_totales' => $this->repository->totalSesionesLive(),
                    'sesiones_en_vivo_o_programadas' => $this->repository->sesionesLiveActivasOProgramadas(),
                    'interacciones_totales' => $this->repository->totalInteraccionesLive(),
                ],
            ];
        });
    }
}
