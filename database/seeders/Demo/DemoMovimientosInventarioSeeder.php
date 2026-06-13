<?php

namespace Database\Seeders\Demo;

use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Models\Inventario;
use App\Models\MovimientoInventario;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DemoMovimientosInventarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::first();
        $inventarios = Inventario::with('producto')->get();

        if ($inventarios->isEmpty()) {
            return;
        }

        $movimientos = [];
        $motivosEntrada = ['Recepción de mercadería de proveedor', 'Devolución de cliente', 'Ajuste positivo por conteo'];
        $motivosSalida = ['Venta por WhatsApp', 'Venta por Instagram', 'Venta por TikTok', 'Venta Presencial', 'Muestra para influencer'];
        $motivosAjuste = ['Ajuste por inventario físico', 'Mercadería dañada', 'Pérdida desconocida'];

        $fechaBase = Carbon::now()->subDays(60);

        // Generaremos alrededor de 25 movimientos realistas
        for ($i = 0; $i < 25; $i++) {
            $inventario = $inventarios->random();
            $producto = $inventario->producto;
            
            $esEntrada = (rand(1, 10) > 7); // 30% entradas, 70% salidas/ajustes
            
            if ($esEntrada) {
                $tipo = TipoMovimientoInventarioEnum::ENTRADA;
                $motivo = $motivosEntrada[array_rand($motivosEntrada)];
                $cantidad = rand(10, 50);
                $stockAnterior = rand(0, 10);
                $stockNuevo = $stockAnterior + $cantidad;
            } else {
                $esAjuste = (rand(1, 10) > 8); // 20% de los no-entrada son ajustes
                if ($esAjuste) {
                    $tipo = TipoMovimientoInventarioEnum::AJUSTE;
                    $motivo = $motivosAjuste[array_rand($motivosAjuste)];
                    $cantidad = rand(1, 5);
                    $stockAnterior = rand($cantidad, $cantidad + 10);
                    $stockNuevo = $stockAnterior - $cantidad; // Simulando ajuste negativo
                } else {
                    $tipo = TipoMovimientoInventarioEnum::SALIDA;
                    $motivo = $motivosSalida[array_rand($motivosSalida)];
                    $cantidad = rand(1, 3);
                    $stockAnterior = rand($cantidad, $cantidad + 20);
                    $stockNuevo = $stockAnterior - $cantidad;
                }
            }

            $fechaMovimiento = clone $fechaBase;
            $fechaMovimiento->addDays(rand(1, 59))->addHours(rand(8, 20))->addMinutes(rand(0, 59));

            $movimientos[] = [
                'cod_inventario' => $inventario->cod_inventario,
                'cod_producto' => $producto->cod_producto,
                'tipo_movimiento_mov' => $tipo->value,
                'cantidad_mov' => $cantidad,
                'stock_anterior_mov' => $stockAnterior,
                'stock_nuevo_mov' => $stockNuevo,
                'motivo_mov' => $motivo,
                'observacion_mov' => 'Generado por Demo Seeder para ' . $producto->nombre_pro,
                'cod_usuario_responsable' => $admin ? $admin->cod_usuario : 1,
                'created_at' => $fechaMovimiento,
                'updated_at' => $fechaMovimiento,
            ];
        }

        // Ordenamos por fecha para mantener coherencia en la inserción
        usort($movimientos, function($a, $b) {
            return $a['created_at']->timestamp <=> $b['created_at']->timestamp;
        });

        foreach ($movimientos as $mov) {
            MovimientoInventario::create($mov);
        }
    }
}
