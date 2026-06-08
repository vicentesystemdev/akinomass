<?php

namespace App\Domains\VentasRedes\Services;

use App\Models\VentaRed;
use RuntimeException;

class TotalesVentaRedService
{
    public function calcular(array $detalles, float $descuento = 0): array
    {
        $detallesCalculados = array_map(function (array $detalle): array {
            $subtotal = (int) $detalle['cantidad'] * (float) $detalle['precio_unitario'];

            return [...$detalle, 'subtotal' => round($subtotal, 2)];
        }, $detalles);

        $subtotal = array_reduce($detallesCalculados, fn (float $acc, array $detalle): float => $acc + (float) $detalle['subtotal'], 0.0);
        $total = $subtotal - $descuento;

        if ($total < 0) {
            throw new RuntimeException('El total de la venta por redes no puede ser negativo.');
        }

        return [
            'detalles' => $detallesCalculados,
            'subtotal' => round($subtotal, 2),
            'descuento' => round($descuento, 2),
            'total' => round($total, 2),
        ];
    }

    public function recalcular(VentaRed $ventaRed): VentaRed
    {
        $ventaRed->load('detalles');

        $totales = $this->calcular(
            $ventaRed->detalles->map(fn ($detalle): array => [
                'cantidad' => (int) $detalle->cantidad,
                'precio_unitario' => (float) $detalle->precio_unitario,
            ])->all(),
            (float) $ventaRed->descuento,
        );

        $ventaRed->update([
            'subtotal' => $totales['subtotal'],
            'total' => $totales['total'],
        ]);

        return $ventaRed->refresh();
    }
}
