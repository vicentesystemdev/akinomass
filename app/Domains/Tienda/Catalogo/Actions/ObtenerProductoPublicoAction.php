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

        if (!$producto) {
            return null;
        }

        $producto->stock_disponible = $this->service->obtenerStockDisponible($producto);
        $producto->disponible = $this->service->estaDisponible($producto);
        $producto->stock_badge = $this->service->calcularStockBadge($producto);
        $producto->makeHidden(['precio_costo_pro']);

        return $producto;
    }
}
