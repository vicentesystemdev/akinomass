<?php

namespace App\Domains\Tienda\Carrito\Services;

use App\Models\Inventario;

class StockDisponibleTiendaService
{
    public function __construct(
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function obtenerStockDisponible(int $codProducto): int
    {
        $inventario = Inventario::where('cod_producto', $codProducto)
            ->where('activo_inv', true)
            ->first();

        if (!$inventario) {
            return 0;
        }

        $stockFisico = (int) $inventario->stock_actual_inv;
        $stockReservado = $this->reservaService->sumarReservasActivasPorProducto($codProducto);

        return max(0, $stockFisico - $stockReservado);
    }

    public function obtenerStockFisico(int $codProducto): int
    {
        $inventario = Inventario::where('cod_producto', $codProducto)
            ->where('activo_inv', true)
            ->first();

        return $inventario ? (int) $inventario->stock_actual_inv : 0;
    }

    public function estaDisponible(int $codProducto, int $cantidadSolicitada): bool
    {
        return $this->obtenerStockDisponible($codProducto) >= $cantidadSolicitada;
    }
}
