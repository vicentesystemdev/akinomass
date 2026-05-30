<?php

namespace App\Domains\Tienda\Catalogo\Services;

use App\Models\Inventario;
use App\Models\Producto;

class CatalogoPublicoService
{
    public function calcularStockBadge(Producto $producto): string
    {
        $inventario = $producto->inventario;

        if (!$inventario || !$inventario->activo_inv) {
            return 'no_disponible';
        }

        if ($inventario->stock_actual_inv <= 0) {
            return 'agotado';
        }

        if ($inventario->stock_actual_inv <= $inventario->stock_minimo_inv) {
            return 'ultimo_stock';
        }

        return 'disponible';
    }

    public function obtenerStockDisponible(Producto $producto): int
    {
        $inventario = $producto->inventario;

        if (!$inventario || !$inventario->activo_inv) {
            return 0;
        }

        return max(0, $inventario->stock_actual_inv);
    }

    public function estaDisponible(Producto $producto): bool
    {
        return $producto->estado_pro === 'activo'
            && $producto->inventario
            && $producto->inventario->activo_inv
            && $producto->inventario->stock_actual_inv > 0;
    }
}
