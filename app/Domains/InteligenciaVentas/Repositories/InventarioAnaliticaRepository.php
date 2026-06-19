<?php

namespace App\Domains\InteligenciaVentas\Repositories;

use App\Models\Inventario;

class InventarioAnaliticaRepository
{
    public function stockActual(int $codProducto, ?int $codVarianteProducto = null): int
    {
        return (int) (Inventario::where('cod_producto', $codProducto)
            ->when($codVarianteProducto, fn ($query) => $query->where('cod_variante_producto', $codVarianteProducto), fn ($query) => $query->whereNull('cod_variante_producto'))
            ->where('activo_inv', true)
            ->sum('stock_actual_inv'));
    }

    public function stockTotalProducto(int $codProducto): int
    {
        return (int) Inventario::where('cod_producto', $codProducto)
            ->where('activo_inv', true)
            ->sum('stock_actual_inv');
    }
}
