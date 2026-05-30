<?php

namespace App\Domains\Tienda\Catalogo\Actions;

use App\Domains\Tienda\Catalogo\Repositories\CatalogoPublicoRepository;
use App\Domains\Tienda\Catalogo\Services\CatalogoPublicoService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListarProductosPublicosAction
{
    public function __construct(
        private CatalogoPublicoRepository $repository,
        private CatalogoPublicoService $service,
    ) {}

    public function execute(array $filtros): LengthAwarePaginator
    {
        $productos = $this->repository->listarPaginado(
            codCategoria: $filtros['cod_categoria_producto'] ?? null,
            busqueda: $filtros['q'] ?? null,
            orden: $filtros['orden'] ?? null,
            soloDisponibles: (bool) ($filtros['solo_disponibles'] ?? false),
            porPagina: (int) ($filtros['per_page'] ?? 24),
        );

        $productos->getCollection()->transform(function ($producto) {
            $producto->stock_disponible = $this->service->obtenerStockDisponible($producto);
            $producto->disponible = $this->service->estaDisponible($producto);
            $producto->stock_badge = $this->service->calcularStockBadge($producto);
            return $producto;
        });

        return $productos;
    }
}
