<?php

namespace App\Domains\Tienda\Catalogo\Actions;

use App\Domains\Tienda\Catalogo\Repositories\CatalogoPublicoRepository;
use App\Domains\Tienda\Catalogo\Services\CatalogoPublicoService;
use App\Models\Producto;

class ObtenerProductoPublicoAction
{
    public function __construct(
        private CatalogoPublicoRepository $repository,
        private CatalogoPublicoService $service,
    ) {}

    public function execute(int $codProducto): ?Producto
    {
        $producto = $this->repository->obtenerPorId($codProducto);

        if (! $producto) {
            return null;
        }

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
        $producto->makeHidden(['precio_costo_pro']);

        return $producto;
    }
}
