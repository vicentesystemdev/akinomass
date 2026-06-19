<?php

namespace Database\Seeders\Demo;

use App\Models\Inventario;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\VarianteProducto;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DemoDefensaInventarioRealistaSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::role('Administrador')->first();
        $adminId = $admin?->id;

        $productos = Producto::all();
        $fechaInicial = Carbon::parse('2025-06-30 08:00:00');

        foreach ($productos as $producto) {
            $variantes = VarianteProducto::where('cod_producto', $producto->cod_producto)->get();

            if ($variantes->isEmpty()) {
                // Producto sin variantes (como Accesorios)
                $stockInicial = 250; // Gran stock inicial para accesorios
                $stockMinimo = 10;
                $ubicacion = 'Almacén Accesorios B-1';

                $inventario = Inventario::updateOrCreate(
                    [
                        'cod_producto' => $producto->cod_producto,
                        'cod_variante_producto' => null,
                    ],
                    [
                        'stock_actual_inv' => $stockInicial,
                        'stock_minimo_inv' => $stockMinimo,
                        'ubicacion_inv' => $ubicacion,
                        'activo_inv' => true,
                    ]
                );

                // Forzar fecha de creación
                $inventario->created_at = $fechaInicial;
                $inventario->save();

                // Registrar movimiento inicial
                $mov = MovimientoInventario::create([
                    'cod_inventario' => $inventario->cod_inventario,
                    'cod_producto' => $producto->cod_producto,
                    'tipo_movimiento_mov' => 'entrada',
                    'cantidad_mov' => $stockInicial,
                    'stock_anterior_mov' => 0,
                    'stock_nuevo_mov' => $stockInicial,
                    'motivo_mov' => 'Carga inicial de inventario para defensa.',
                    'observacion_mov' => 'Ingreso de mercadería lote inicial.',
                    'cod_usuario_responsable' => $adminId,
                ]);
                $mov->created_at = $fechaInicial;
                $mov->save();
            } else {
                // Producto con variantes (ropa/pantalon)
                // El producto base queda con inventario en 0 o no se le crea registro base.
                // En Laragon, las variantes tienen cada una su propio registro en la tabla inventarios.
                
                foreach ($variantes as $variante) {
                    // Definir stock inicial según categoría
                    $categoria = $producto->categoria->nombre_cat;
                    $stockInicial = 100; // default
                    $stockMinimo = 5;

                    if ($categoria === 'Jeans cargo') {
                        $stockInicial = 130; // Más stock para soportar alta demanda
                        $stockMinimo = 8;
                    } elseif ($categoria === 'Chamarras') {
                        $stockInicial = 180; // Alto stock inicial para soportar picos estacionales de invierno
                        $stockMinimo = 10;
                    } elseif ($categoria === 'Prendas en liquidación') {
                        $stockInicial = 60; // Stock medio-bajo
                        $stockMinimo = 2;
                    } elseif ($categoria === 'Poleras oversize') {
                        $stockInicial = 150;
                        $stockMinimo = 12;
                    }

                    $inventario = Inventario::updateOrCreate(
                        [
                            'cod_producto' => $producto->cod_producto,
                            'cod_variante_producto' => $variante->cod_variante_producto,
                        ],
                        [
                            'stock_actual_inv' => $stockInicial,
                            'stock_minimo_inv' => $stockMinimo,
                            'ubicacion_inv' => 'Almacén Central A-2',
                            'activo_inv' => true,
                        ]
                    );

                    $inventario->created_at = $fechaInicial;
                    $inventario->save();

                    // Registrar movimiento inicial
                    $mov = MovimientoInventario::create([
                        'cod_inventario' => $inventario->cod_inventario,
                        'cod_producto' => $producto->cod_producto,
                        'tipo_movimiento_mov' => 'entrada',
                        'cantidad_mov' => $stockInicial,
                        'stock_anterior_mov' => 0,
                        'stock_nuevo_mov' => $stockInicial,
                        'motivo_mov' => "Carga inicial variante {$variante->sku_variante_producto}.",
                        'observacion_mov' => 'Ingreso de lote por tallas.',
                        'cod_usuario_responsable' => $adminId,
                    ]);
                    $mov->created_at = $fechaInicial;
                    $mov->save();
                }
            }
        }
    }
}
