<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Services\CarritoCalculoService;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Models\DetalleCarrito;
use App\Models\Inventario;
use Illuminate\Validation\ValidationException;

class ActualizarCantidadCarritoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
        private CarritoCalculoService $calculoService,
    ) {}

    public function execute(DetalleCarrito $detalle, int $cantidad): DetalleCarrito
    {
        $inventario = Inventario::where('cod_producto', $detalle->cod_producto)
            ->where('activo_inv', true)
            ->first();

        if (!$inventario || $inventario->stock_actual_inv < $cantidad) {
            throw ValidationException::withMessages([
                'cantidad' => ['Stock insuficiente. Disponible: ' . ($inventario->stock_actual_inv ?? 0)],
            ]);
        }

        $detalleActualizado = $this->persistenciaService->actualizarDetalle(
            $detalle->cod_detalle_carrito,
            $cantidad
        );

        $this->calculoService->recalcularSubtotales($detalle->carrito);

        return $detalleActualizado;
    }
}
