<?php

namespace App\Domains\Inventario\Services;

use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Models\Inventario;
use App\Models\MovimientoInventario;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class InventarioService
{
    public function crearOActualizarInventario(array $data): Inventario
    {
        return Inventario::updateOrCreate(
            ['cod_producto' => $data['cod_producto']],
            [
                'stock_minimo_inv' => $data['stock_minimo_inv'] ?? 0,
                'ubicacion_inv' => $data['ubicacion_inv'] ?? null,
                'activo_inv' => $data['activo_inv'] ?? true,
            ]
        );
    }

    public function registrarMovimiento(int $codProducto, TipoMovimientoInventarioEnum $tipo, int $cantidad, string $motivo, ?string $observacion, ?int $codUsuario, ?int $stockAjuste = null): Inventario
    {
        return DB::transaction(function () use ($codProducto, $tipo, $cantidad, $motivo, $observacion, $codUsuario, $stockAjuste) {
            $inventario = Inventario::firstOrCreate(['cod_producto' => $codProducto], ['stock_actual_inv' => 0, 'stock_minimo_inv' => 0, 'activo_inv' => true]);
            $stockAnterior = $inventario->stock_actual_inv;
            $stockNuevo = match ($tipo) {
                TipoMovimientoInventarioEnum::ENTRADA, TipoMovimientoInventarioEnum::DEVOLUCION, TipoMovimientoInventarioEnum::CANCELACION => $stockAnterior + $cantidad,
                TipoMovimientoInventarioEnum::SALIDA, TipoMovimientoInventarioEnum::RESERVA => $stockAnterior - $cantidad,
                TipoMovimientoInventarioEnum::AJUSTE => $stockAjuste ?? $stockAnterior,
            };

            if ($stockNuevo < 0) {
                throw new RuntimeException('No se permite stock negativo.');
            }

            $inventario->update(['stock_actual_inv' => $stockNuevo]);

            MovimientoInventario::create([
                'cod_inventario' => $inventario->cod_inventario,
                'cod_producto' => $codProducto,
                'tipo_movimiento_mov' => $tipo,
                'cantidad_mov' => $tipo === TipoMovimientoInventarioEnum::AJUSTE ? $stockNuevo - $stockAnterior : $cantidad,
                'stock_anterior_mov' => $stockAnterior,
                'stock_nuevo_mov' => $stockNuevo,
                'motivo_mov' => $motivo,
                'observacion_mov' => $observacion,
                'cod_usuario_responsable' => $codUsuario,
            ]);

            return $inventario->refresh();
        });
    }
}
