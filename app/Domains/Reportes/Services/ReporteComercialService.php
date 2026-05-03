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
            return [
                'filtros' => $filtros,
                'ventas_por_fecha' => $this->repository->ventasPorFecha($filtros),
                'pedidos_por_estado' => $this->repository->pedidosPorEstado($filtros),
                'pagos_por_estado' => $this->repository->pagosPorEstado($filtros),
                'leads_por_estado' => $this->repository->leadsPorEstado($filtros),
                'ventas_por_canal' => $this->repository->ventasPorCanal($filtros),
                'ventas_por_tipo_flujo' => $this->repository->ventasPorTipoFlujo($filtros),
                'productos_stock_bajo' => $this->repository->productosConStockBajo(),
                'productos_mas_vendidos' => $this->repository->productosMasVendidos($filtros),
                'opciones_filtros' => [
                    'canales_venta' => $this->repository->canalesVenta(),
                    'tipos_flujo_comercial' => $this->repository->tiposFlujoComercial(),
                ],
            ];
        });
    }
}
