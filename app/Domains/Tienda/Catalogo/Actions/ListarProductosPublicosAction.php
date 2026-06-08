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
            codTalla: isset($filtros['cod_talla_producto']) ? (int) $filtros['cod_talla_producto'] : null,
            busqueda: $filtros['q'] ?? null,
            orden: $filtros['orden'] ?? null,
            soloDisponibles: (bool) ($filtros['solo_disponibles'] ?? false),
            porPagina: (int) ($filtros['per_page'] ?? 24),
        );

        $productos->getCollection()->transform(function ($producto) {
            $tieneVariantes = $producto->variantes->isNotEmpty();

            $producto->variantes->each(function ($variante): void {
                $variante->stock_disponible = $this->service->obtenerStockDisponibleVariante($variante);
                $variante->disponible = $variante->stock_disponible > 0;
                $minimo = (int) ($variante->inventario?->stock_minimo_inv ?? 0);
                $variante->stock_badge = match (true) {
                    $variante->stock_disponible <= 0 => 'agotado',
                    $minimo > 0 && $variante->stock_disponible <= $minimo => 'ultimo_stock',
                    default => 'disponible',
                };
            });

            $producto->stock_disponible = $tieneVariantes
                ? $producto->variantes->sum('stock_disponible')
                : $this->service->obtenerStockDisponible($producto);
            $producto->disponible = $producto->stock_disponible > 0;

            $minimoBase = $tieneVariantes ? 0 : (int) ($producto->inventario?->stock_minimo_inv ?? 0);
            $producto->stock_badge = match (true) {
                $producto->stock_disponible <= 0 => 'agotado',
                $minimoBase > 0 && $producto->stock_disponible <= $minimoBase => 'ultimo_stock',
                default => 'disponible',
            };

            return $producto;
        });

        return $productos;
    }
}
