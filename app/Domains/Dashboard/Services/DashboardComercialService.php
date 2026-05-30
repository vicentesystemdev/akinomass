<?php

namespace App\Domains\Dashboard\Services;

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
                'leads' => $this->repository->getLeadsStats(),
                'productos' => $this->repository->getProductosStats(),
                'pedidos' => $this->repository->getPedidosStats(),
                'pagos' => $this->repository->getPagosStats(),
                'ventas_por_canal' => $this->repository->ventasPorCanal(),
                'ventas_por_tipo_flujo' => $this->repository->ventasPorTipoFlujo(),
                'live_sales' => $this->repository->getLiveStats(),
            ];
        });
    }
}
