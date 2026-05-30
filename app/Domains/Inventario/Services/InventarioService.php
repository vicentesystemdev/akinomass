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
        $movimientos = [[
            'cod_producto' => $codProducto,
            'tipo' => $tipo,
            'cantidad' => $cantidad,
            'motivo' => $motivo,
            'observacion' => $observacion,
            'cod_usuario' => $codUsuario,
            'stock_ajuste' => $stockAjuste,
        ]];

        return $this->registrarMovimientosBatch($movimientos)[0] ?? throw new RuntimeException('Error al registrar movimiento.');
    }

    public function registrarMovimientosBatch(array $movimientos): array
    {
        if (empty($movimientos)) return [];

        return DB::transaction(function () use ($movimientos) {
            $productosIds = array_unique(array_column($movimientos, 'cod_producto'));

            $inventarios = Inventario::whereIn('cod_producto', $productosIds)
                ->get()
                ->keyBy('cod_producto');

            foreach ($productosIds as $codProducto) {
                if (!isset($inventarios[$codProducto])) {
                    $inv = Inventario::create(['cod_producto' => $codProducto, 'stock_actual_inv' => 0, 'stock_minimo_inv' => 0, 'activo_inv' => true]);
                    $inventarios[$codProducto] = $inv;
                }
            }

            $entradasMovimiento = [];
            $resultados = [];

            foreach ($movimientos as $m) {
                $inventario = $inventarios[$m['cod_producto']];
                $stockAnterior = $inventario->stock_actual_inv;
                $tipo = $m['tipo'];
                $cantidad = $m['cantidad'];

                $stockNuevo = match ($tipo) {
                    TipoMovimientoInventarioEnum::ENTRADA, TipoMovimientoInventarioEnum::DEVOLUCION, TipoMovimientoInventarioEnum::CANCELACION => $stockAnterior + $cantidad,
                    TipoMovimientoInventarioEnum::SALIDA, TipoMovimientoInventarioEnum::RESERVA => $stockAnterior - $cantidad,
                    TipoMovimientoInventarioEnum::AJUSTE => $m['stock_ajuste'] ?? $stockAnterior,
                };

                if ($stockNuevo < 0) {
                    throw new RuntimeException('No se permite stock negativo para producto '.$m['cod_producto']);
                }

                $inventario->stock_actual_inv = $stockNuevo;
                $inventario->save();

                $entradasMovimiento[] = [
                    'cod_inventario' => $inventario->cod_inventario,
                    'cod_producto' => $m['cod_producto'],
                    'tipo_movimiento_mov' => $tipo,
                    'cantidad_mov' => $tipo === TipoMovimientoInventarioEnum::AJUSTE ? $stockNuevo - $stockAnterior : $cantidad,
                    'stock_anterior_mov' => $stockAnterior,
                    'stock_nuevo_mov' => $stockNuevo,
                    'motivo_mov' => $m['motivo'],
                    'observacion_mov' => $m['observacion'] ?? null,
                    'cod_usuario_responsable' => $m['cod_usuario'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $resultados[] = $inventario->fresh();
            }

            MovimientoInventario::insert($entradasMovimiento);

            return $resultados;
        });
    }
}
