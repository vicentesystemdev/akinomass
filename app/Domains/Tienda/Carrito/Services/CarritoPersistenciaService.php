<?php

namespace App\Domains\Tienda\Carrito\Services;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Models\Carrito;
use App\Models\DetalleCarrito;
use Illuminate\Support\Collection;

class CarritoPersistenciaService
{
    public function obtenerPorUserId(int $userId): ?Carrito
    {
        return Carrito::with('detalles')
            ->where('user_id', $userId)
            ->where('estado_car', EstadoCarritoEnum::ACTIVO)
            ->first();
    }

    public function obtenerPorSessionId(string $sessionId): ?Carrito
    {
        return Carrito::with('detalles')
            ->where('session_id_car', $sessionId)
            ->where('estado_car', EstadoCarritoEnum::ACTIVO)
            ->first();
    }

    public function crear(?int $userId, ?string $sessionId, ?int $codCliente): Carrito
    {
        return Carrito::create([
            'user_id' => $userId,
            'session_id_car' => $sessionId,
            'cod_cliente' => $codCliente,
            'estado_car' => EstadoCarritoEnum::ACTIVO,
            'moneda_car' => 'BOB',
            'subtotal_car' => 0,
            'total_car' => 0,
        ]);
    }

    public function agregarDetalle(Carrito $carrito, array $itemData): DetalleCarrito
    {
        $existente = DetalleCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->where('cod_producto', $itemData['cod_producto'])
            ->first();

        if ($existente) {
            $existente->update([
                'cantidad_dca' => $existente->cantidad_dca + $itemData['cantidad'],
                'subtotal_dca' => ($existente->cantidad_dca + $itemData['cantidad']) * $existente->precio_unitario_dca,
            ]);

            return $existente;
        }

        return DetalleCarrito::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_producto' => $itemData['cod_producto'],
            'cantidad_dca' => $itemData['cantidad'],
            'precio_unitario_dca' => $itemData['precio_unitario'],
            'subtotal_dca' => $itemData['cantidad'] * $itemData['precio_unitario'],
            'nombre_producto_dca' => $itemData['nombre_snapshot'],
            'sku_producto_dca' => $itemData['sku_snapshot'] ?? null,
        ]);
    }

    public function actualizarDetalle(int $codDetalleCarrito, int $cantidad): DetalleCarrito
    {
        $detalle = DetalleCarrito::findOrFail($codDetalleCarrito);
        $detalle->update([
            'cantidad_dca' => $cantidad,
            'subtotal_dca' => $cantidad * $detalle->precio_unitario_dca,
        ]);

        return $detalle;
    }

    public function eliminarDetalle(int $codDetalleCarrito): void
    {
        DetalleCarrito::findOrFail($codDetalleCarrito)->delete();
    }

    public function vaciar(Carrito $carrito): void
    {
        $carrito->detalles()->delete();
        $carrito->update([
            'subtotal_car' => 0,
            'total_car' => 0,
        ]);
    }

    public function contarItems(Carrito $carrito): int
    {
        return $carrito->detalles()->sum('cantidad_dca');
    }
}
