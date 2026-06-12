<?php

namespace Database\Seeders\Demo;

use App\Models\Inventario;
use App\Models\Producto;
use App\Models\TallaProducto;
use App\Models\VarianteProducto;
use Illuminate\Database\Seeder;

class DemoVariantesSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Jean Mom Fit Azul (ROPA-JEA-002) - Tallas de pantalón: 30, 32, 34
        $jean = Producto::where('sku_pro', 'ROPA-JEA-002')->first();
        if ($jean) {
            $tallasJean = [
                '30' => ['stock' => 8, 'sku' => 'ROPA-JEA-002-30'],
                '32' => ['stock' => 12, 'sku' => 'ROPA-JEA-002-32'],
                '34' => ['stock' => 5, 'sku' => 'ROPA-JEA-002-34'],
            ];

            foreach ($tallasJean as $codTalla => $vData) {
                $talla = TallaProducto::where('codigo_talla_producto', $codTalla)->first();
                if ($talla) {
                    $variante = VarianteProducto::updateOrCreate(
                        [
                            'cod_producto' => $jean->cod_producto,
                            'cod_talla_producto' => $talla->cod_talla_producto,
                        ],
                        [
                            'sku_variante_producto' => $vData['sku'],
                            'precio_venta_variante' => $jean->precio_venta_pro,
                            'estado_variante_producto' => 'activo',
                            'activo_variante_producto' => true,
                        ]
                    );

                    // Crear inventario de la variante
                    Inventario::updateOrCreate(
                        [
                            'cod_producto' => $jean->cod_producto,
                            'cod_variante_producto' => $variante->cod_variante_producto,
                        ],
                        [
                            'stock_actual_inv' => $vData['stock'],
                            'stock_minimo_inv' => 2,
                            'ubicacion_inv' => 'Almacén Central A-2',
                            'activo_inv' => true,
                        ]
                    );
                }
            }
            $this->command->info('Variantes de Jean Mom Fit Azul (tallas 30, 32, 34) creadas.');
        }

        // 2. Vestido Casual Floreado (ROPA-VES-005) - Tallas de ropa: S, M, L
        $vestido = Producto::where('sku_pro', 'ROPA-VES-005')->first();
        if ($vestido) {
            $tallasVestido = [
                'S' => ['stock' => 6, 'sku' => 'ROPA-VES-005-S'],
                'M' => ['stock' => 10, 'sku' => 'ROPA-VES-005-M'],
                'L' => ['stock' => 4, 'sku' => 'ROPA-VES-005-L'],
            ];

            foreach ($tallasVestido as $codTalla => $vData) {
                $talla = TallaProducto::where('codigo_talla_producto', $codTalla)->first();
                if ($talla) {
                    $variante = VarianteProducto::updateOrCreate(
                        [
                            'cod_producto' => $vestido->cod_producto,
                            'cod_talla_producto' => $talla->cod_talla_producto,
                        ],
                        [
                            'sku_variante_producto' => $vData['sku'],
                            'precio_venta_variante' => $vestido->precio_venta_pro,
                            'estado_variante_producto' => 'activo',
                            'activo_variante_producto' => true,
                        ]
                    );

                    // Crear inventario de la variante
                    Inventario::updateOrCreate(
                        [
                            'cod_producto' => $vestido->cod_producto,
                            'cod_variante_producto' => $variante->cod_variante_producto,
                        ],
                        [
                            'stock_actual_inv' => $vData['stock'],
                            'stock_minimo_inv' => 1,
                            'ubicacion_inv' => 'Almacén Central A-2',
                            'activo_inv' => true,
                        ]
                    );
                }
            }
            $this->command->info('Variantes de Vestido Casual Floreado (tallas S, M, L) creadas.');
        }
    }
}
