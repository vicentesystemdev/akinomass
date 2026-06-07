<?php

namespace App\Domains\Tienda\Carrito\Services;

use App\Models\Inventario;

class StockDisponibleTiendaService
{
    public function __construct(
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function obtenerStockDisponible(int $codProducto, ?int $codVarianteProducto = null): int
    {
        $inventario = Inventario::where('cod_producto', $codProducto)
            ->when($codVarianteProducto, fn ($query) => $query->where('cod_variante_producto', $codVarianteProducto), fn ($query) => $query->whereNull('cod_variante_producto'))
            ->where('activo_inv', true)
            ->first();

        if (! $inventario) {
            return 0;
        }

        $stockFisico = (int) $inventario->stock_actual_inv;
        $stockReservado = $this->reservaService->sumarReservasActivasPorProducto($codProducto, $codVarianteProducto);

        return max(0, $stockFisico - $stockReservado);
    }

    public function obtenerStockFisico(int $codProducto, ?int $codVarianteProducto = null): int
    {
        $inventario = Inventario::where('cod_producto', $codProducto)
            ->when($codVarianteProducto, fn ($query) => $query->where('cod_variante_producto', $codVarianteProducto), fn ($query) => $query->whereNull('cod_variante_producto'))
            ->where('activo_inv', true)
            ->first();

        return $inventario ? (int) $inventario->stock_actual_inv : 0;
    }

    public function estaDisponible(int $codProducto, int $cantidadSolicitada, ?int $codVarianteProducto = null): bool
    {
        return $this->obtenerStockDisponible($codProducto, $codVarianteProducto) >= $cantidadSolicitada;
    }
}
