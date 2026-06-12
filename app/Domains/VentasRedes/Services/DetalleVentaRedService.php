<?php

namespace App\Domains\VentasRedes\Services;

use App\Domains\Tienda\Carrito\Services\StockDisponibleTiendaService;
use App\Domains\VentasRedes\Enums\EstadoVentaRedEnum;
use App\Models\Producto;
use App\Models\VentaRed;
use App\Models\VentaRedDetalle;
use App\Models\VarianteProducto;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class DetalleVentaRedService
{
    public function __construct(
        private readonly StockDisponibleTiendaService $stockDisponibleService,
        private readonly TotalesVentaRedService $totalesService,
    ) {}

    public function agregar(VentaRed $ventaRed, array $data): VentaRedDetalle
    {
        $this->validarEditable($ventaRed);
        $data = $this->normalizarDetalle($data);
        $this->validarStock($data);

        $detalle = $ventaRed->detalles()->create($data);
        $this->totalesService->recalcular($ventaRed);

        return $detalle->refresh();
    }

    public function actualizar(VentaRed $ventaRed, VentaRedDetalle $detalle, array $data): VentaRedDetalle
    {
        $this->validarEditable($ventaRed);
        $data = $this->normalizarDetalle($data);
        $this->validarStock($data);

        $detalle->update($data);
        $this->totalesService->recalcular($ventaRed);

        return $detalle->refresh();
    }

    public function eliminar(VentaRed $ventaRed, VentaRedDetalle $detalle): void
    {
        $this->validarEditable($ventaRed);
        $detalle->delete();
        $this->totalesService->recalcular($ventaRed);
    }

    public function validarStock(array $data): void
    {
        if (! $this->stockDisponibleService->estaDisponible((int) $data['cod_producto'], (int) $data['cantidad'], $data['cod_variante_producto'] ?? null)) {
            $disponible = $this->stockDisponibleService->obtenerStockDisponible((int) $data['cod_producto'], $data['cod_variante_producto'] ?? null);

            throw ValidationException::withMessages([
                'cantidad' => ["Stock insuficiente. Disponible: {$disponible}."],
            ]);
        }
    }

    private function normalizarDetalle(array $data): array
    {
        $producto = Producto::where('cod_producto', $data['cod_producto'])
            ->where('estado_pro', 'activo')
            ->first();

        if (! $producto) {
            throw ValidationException::withMessages([
                'cod_producto' => ['El producto no esta disponible en catalogo.'],
            ]);
        }

        $variante = null;
        if (! empty($data['cod_variante_producto'])) {
            $variante = VarianteProducto::where('cod_variante_producto', $data['cod_variante_producto'])
                ->where('cod_producto', $producto->cod_producto)
                ->first();

            if (! $variante) {
                throw ValidationException::withMessages([
                    'cod_variante_producto' => ['La variante no pertenece al producto seleccionado.'],
                ]);
            }
        }

        $cantidad = (int) $data['cantidad'];
        $precio = (float) ($data['precio_unitario'] ?? $variante?->precio_venta_variante ?? $producto->precio_venta_pro);

        return [
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $variante?->cod_variante_producto,
            'cod_talla_producto' => $variante?->cod_talla_producto ?? ($data['cod_talla_producto'] ?? null),
            'cantidad' => $cantidad,
            'precio_unitario' => $precio,
            'subtotal' => round($cantidad * $precio, 2),
            'observacion' => $data['observacion'] ?? null,
        ];
    }

    private function validarEditable(VentaRed $ventaRed): void
    {
        if (in_array($ventaRed->estado_venta_red, [EstadoVentaRedEnum::CONVERTIDA_PEDIDO, EstadoVentaRedEnum::CANCELADA], true)) {
            throw new RuntimeException('No se pueden modificar detalles en una venta convertida o cancelada.');
        }
    }
}
