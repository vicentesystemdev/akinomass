<?php

namespace App\Domains\Reportes\Services;

use App\Domains\Reportes\Repositories\ReporteComercialRepository;
use Illuminate\Support\Facades\Cache;

class ReporteComercialService
{
    public function __construct(
        private readonly ReporteComercialRepository $repository,
    ) {
    }

    public function obtenerReportes(array $filtros): array
    {
        $cacheKey = 'reportes:comercial:'.md5(json_encode($filtros));

        return Cache::remember($cacheKey, 300, function () use ($filtros): array {
            $totalInteracciones = $this->repository->totalInteraccionesLive();
            $leadsDesdeLive = $this->repository->leadsDesdeLive();
            $pedidosDesdeLive = $this->repository->pedidosDesdeLive();

            return [
                'filtros' => $filtros,

                // Resumen / KPIs
                'resumen' => [
                    'total_clientes' => $this->repository->totalClientes(),
                    'total_leads' => $this->repository->totalLeads(),
                    'total_pedidos' => $this->repository->totalPedidos(),
                    'total_pagos' => $this->repository->totalPagos(),
                    'monto_total_pagado' => $this->repository->montoTotalPagado(),
                    'total_sesiones_live' => $this->repository->totalSesionesLive(),
                    'total_interacciones_live' => $totalInteracciones,
                ],

                // Ventas
                'ventas_por_fecha' => $this->repository->ventasPorFecha($filtros),
                'ventas_por_canal' => $this->repository->ventasPorCanal($filtros),
                'ventas_por_tipo_flujo' => $this->repository->ventasPorTipoFlujo($filtros),
                'productos_mas_vendidos' => $this->repository->productosMasVendidos($filtros),

                // Pedidos
                'pedidos_por_estado' => $this->repository->pedidosPorEstado($filtros),

                // Pagos
                'pagos_por_estado' => $this->repository->pagosPorEstado($filtros),
                'pagos_por_metodo' => $this->repository->pagosPorMetodo($filtros),

                // CRM
                'leads_por_estado' => $this->repository->leadsPorEstado($filtros),
                'leads_por_canal' => $this->repository->leadsPorCanal($filtros),
                'clientes_por_estado' => $this->repository->clientesPorEstado(),

                // Inventario
                'productos_stock_bajo' => $this->repository->productosConStockBajo(),

                // LiveSales
                'sesiones_live_por_estado' => $this->repository->sesionesLivePorEstado(),
                'interacciones_por_sesion' => $this->repository->interaccionesPorSesion(),
                'leads_desde_live' => $leadsDesdeLive,
                'pedidos_desde_live' => $pedidosDesdeLive,
                'tasa_conversion_live_lead' => $totalInteracciones > 0
                    ? round(($leadsDesdeLive / $totalInteracciones) * 100, 1)
                    : 0,
                'tasa_conversion_live_pedido' => $totalInteracciones > 0
                    ? round(($pedidosDesdeLive / $totalInteracciones) * 100, 1)
                    : 0,
                'tasa_conversion_lead_pedido' => $leadsDesdeLive > 0
                    ? round(($pedidosDesdeLive / $leadsDesdeLive) * 100, 1)
                    : 0,

                // Opciones de filtros
                'opciones_filtros' => [
                    'canales_venta' => $this->repository->canalesVenta(),
                    'tipos_flujo_comercial' => $this->repository->tiposFlujoComercial(),
                ],
            ];
        });
    }
}
