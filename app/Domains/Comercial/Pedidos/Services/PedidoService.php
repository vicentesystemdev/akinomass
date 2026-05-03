<?php

namespace App\Domains\Comercial\Pedidos\Services;

use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Domains\Inventario\Services\InventarioService;
use App\Models\Pedido;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class PedidoService
{
    public function __construct(private readonly InventarioService $inventarioService) {}

    public function generarNumeroPedido(): string
    {
        $next = (int) Pedido::max('cod_pedido') + 1;
        return 'PED-'.str_pad((string) $next, 6, '0', STR_PAD_LEFT);
    }

    public function calcularTotales(array $detalles, float $descuento = 0): array
    {
        $detallesCalculados = array_map(function (array $detalle) {
            $subtotal = (float) $detalle['cantidad_det'] * (float) $detalle['precio_unitario_det'];
            return [...$detalle, 'subtotal_det' => round($subtotal, 2)];
        }, $detalles);

        $subtotal = array_reduce($detallesCalculados, fn ($acc, $d) => $acc + (float) $d['subtotal_det'], 0.0);
        $total = $subtotal - $descuento;

        if ($total < 0) throw new RuntimeException('El total del pedido no puede ser negativo.');

        return ['detalles' => $detallesCalculados, 'subtotal' => round($subtotal, 2), 'descuento' => round($descuento, 2), 'total' => round($total, 2)];
    }

    public function actualizarDetallesYTotales(Pedido $pedido, array $detalles, float $descuento): Pedido
    {
        if ($pedido->estado_ped !== EstadoPedidoEnum::BORRADOR) throw new RuntimeException('Solo se puede editar un pedido en borrador.');

        $totales = $this->calcularTotales($detalles, $descuento);
        return DB::transaction(function () use ($pedido, $totales, $descuento) {
            $pedido->detalles()->delete();
            $pedido->detalles()->createMany($totales['detalles']);
            $pedido->update(['subtotal_ped' => $totales['subtotal'], 'descuento_ped' => $descuento, 'total_ped' => $totales['total']]);
            return $pedido->refresh()->load('detalles.producto');
        });
    }

    public function confirmar(Pedido $pedido, ?int $codUsuario): Pedido
    {
        if ($pedido->estado_ped !== EstadoPedidoEnum::BORRADOR) throw new RuntimeException('Solo se puede confirmar un pedido en borrador.');
        $pedido->loadMissing('detalles');

        return DB::transaction(function () use ($pedido, $codUsuario) {
            foreach ($pedido->detalles as $detalle) {
                $inventario = \App\Models\Inventario::where('cod_producto', $detalle->cod_producto)->first();
                $stock = $inventario?->stock_actual_inv ?? 0;
                if ($stock < $detalle->cantidad_det) throw new RuntimeException('Stock insuficiente para el producto '.$detalle->cod_producto);
            }
            foreach ($pedido->detalles as $detalle) {
                $this->inventarioService->registrarMovimiento($detalle->cod_producto, TipoMovimientoInventarioEnum::SALIDA, (int) $detalle->cantidad_det, 'confirmacion_pedido', 'Pedido '.$pedido->numero_pedido_ped, $codUsuario);
            }
            $pedido->update(['estado_ped' => EstadoPedidoEnum::CONFIRMADO]);
            return $pedido->refresh();
        });
    }

    public function cancelar(Pedido $pedido, ?int $codUsuario): Pedido
    {
        if ($pedido->estado_ped === EstadoPedidoEnum::CANCELADO) throw new RuntimeException('El pedido ya está cancelado.');

        return DB::transaction(function () use ($pedido, $codUsuario) {
            $estabaConfirmado = $pedido->estado_ped === EstadoPedidoEnum::CONFIRMADO;
            $pedido->loadMissing('detalles');
            if ($estabaConfirmado) {
                foreach ($pedido->detalles as $detalle) {
                    $this->inventarioService->registrarMovimiento($detalle->cod_producto, TipoMovimientoInventarioEnum::CANCELACION, (int) $detalle->cantidad_det, 'cancelacion_pedido', 'Cancelación pedido '.$pedido->numero_pedido_ped, $codUsuario);
                }
            }
            $pedido->update(['estado_ped' => EstadoPedidoEnum::CANCELADO]);
            return $pedido->refresh();
        });
    }
}
