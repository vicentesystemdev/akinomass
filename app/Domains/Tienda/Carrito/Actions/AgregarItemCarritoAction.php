<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\DTOs\AgregarItemCarritoData;
use App\Domains\Tienda\Carrito\Services\CarritoCalculoService;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Models\Carrito;
use App\Models\DetalleCarrito;
use App\Models\Inventario;
use App\Models\Producto;
use Illuminate\Validation\ValidationException;

class AgregarItemCarritoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
        private CarritoCalculoService $calculoService,
    ) {}

    public function execute(Carrito $carrito, AgregarItemCarritoData $data): DetalleCarrito
    {
        $producto = Producto::where('cod_producto', $data->codProducto)
            ->where('estado_pro', 'activo')
            ->first();

        if (!$producto) {
            throw ValidationException::withMessages([
                'cod_producto' => ['El producto no está disponible.'],
            ]);
        }

        $inventario = Inventario::where('cod_producto', $data->codProducto)
            ->where('activo_inv', true)
            ->first();

        if (!$inventario || $inventario->stock_actual_inv < $data->cantidad) {
            throw ValidationException::withMessages([
                'cantidad' => ['Stock insuficiente. Disponible: ' . ($inventario->stock_actual_inv ?? 0)],
            ]);
        }

        $itemsActuales = $this->persistenciaService->contarItems($carrito);
        if ($itemsActuales >= 50) {
            throw ValidationException::withMessages([
                'carrito' => ['El carrito ha alcanzado el límite máximo de 50 líneas.'],
            ]);
        }

        $detalle = $this->persistenciaService->agregarDetalle($carrito, [
            'cod_producto' => $data->codProducto,
            'cantidad' => $data->cantidad,
            'precio_unitario' => (float) $producto->precio_venta_pro,
            'nombre_snapshot' => $producto->nombre_pro,
            'sku_snapshot' => $producto->sku_pro,
        ]);

        $this->calculoService->recalcularSubtotales($carrito);

        return $detalle;
    }
}
