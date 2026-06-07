<?php

namespace App\Domains\Tienda\Catalogo\Services;

use App\Domains\Tienda\Carrito\Services\StockDisponibleTiendaService;
use App\Models\Producto;

class CatalogoPublicoService
{
    public function __construct(
        private StockDisponibleTiendaService $stockDisponibleService,
    ) {}

    public function calcularStockBadge(Producto $producto): string
    {
        $inventario = $producto->inventario;

        if (!$inventario || !$inventario->activo_inv) {
            return 'no_disponible';
        }

        $stockDisponible = $this->stockDisponibleService->obtenerStockDisponible($producto->cod_producto);

        if ($stockDisponible <= 0) {
            return 'agotado';
        }

        if ($stockDisponible <= $inventario->stock_minimo_inv) {
            return 'ultimo_stock';
        }

        return 'disponible';
    }

    public function obtenerStockDisponible(Producto $producto): int
    {
        return $this->stockDisponibleService->obtenerStockDisponible($producto->cod_producto);
    }

    public function estaDisponible(Producto $producto): bool
    {
        return $producto->estado_pro === 'activo'
            && $this->obtenerStockDisponible($producto) > 0;
    }
}
