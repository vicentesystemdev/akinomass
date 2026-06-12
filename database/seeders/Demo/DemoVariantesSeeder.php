<?php

namespace Database\Seeders\Demo;

use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use App\Models\CategoriaProducto;
use App\Models\Inventario;
use App\Models\Producto;
use App\Models\TallaProducto;
use App\Models\VarianteProducto;
use Illuminate\Database\Seeder;

class DemoVariantesSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Asegurar la categoría PANTALONES (ID 6 o crear/buscar)
        $categoria = CategoriaProducto::updateOrCreate(
            ['cod_categoria_producto' => 6],
            [
                'nombre_cat' => 'PANTALONES',
                'descripcion_cat' => 'Pantalones, jeans y bermudas.',
                'activo_cat' => true,
            ]
        );

        // 2. Crear producto Jeans Earth Denim
        $producto = Producto::updateOrCreate(
            ['sku_pro' => 'JEAN-EARTH-01'],
            [
                'cod_categoria_producto' => $categoria->cod_categoria_producto,
                'nombre_pro' => 'Jeans Earth Denim',
                'descripcion_pro' => 'Jeans de mezclilla de algodón orgánico con corte clásico.',
                'precio_venta_pro' => 249.90,
                'precio_costo_pro' => 150.00,
                'estado_pro' => EstadoProductoEnum::ACTIVO,
            ]
        );

        // 3. Crear el inventario base para el producto (debe estar en 0 ya que se controla por variantes)
        Inventario::updateOrCreate(
            [
                'cod_producto' => $producto->cod_producto,
                'cod_variante_producto' => null,
            ],
            [
                'stock_actual_inv' => 0,
                'stock_minimo_inv' => 0,
                'ubicacion_inv' => 'Almacén Demo A-1',
                'activo_inv' => true,
            ]
        );

        // 4. Buscar tallas 30, 32 y 34
        $talla30 = TallaProducto::where('codigo_talla_producto', '30')->first();
        $talla32 = TallaProducto::where('codigo_talla_producto', '32')->first();
        $talla34 = TallaProducto::where('codigo_talla_producto', '34')->first();

        if (!$talla30 || !$talla32 || !$talla34) {
            $this->command->error('No se encontraron las tallas 30, 32 o 34 en el sistema.');
            return;
        }

        $variantesData = [
            ['talla' => $talla30, 'sku' => 'JEAN-EARTH-01-30', 'stock' => 5],
            ['talla' => $talla32, 'sku' => 'JEAN-EARTH-01-32', 'stock' => 0],
            ['talla' => $talla34, 'sku' => 'JEAN-EARTH-01-34', 'stock' => 0],
        ];

        foreach ($variantesData as $data) {
            $variante = VarianteProducto::updateOrCreate(
                [
                    'cod_producto' => $producto->cod_producto,
                    'cod_talla_producto' => $data['talla']->cod_talla_producto,
                ],
                [
                    'sku_variante_producto' => $data['sku'],
                    'precio_venta_variante' => 249.90,
                    'estado_variante_producto' => 'activo',
                    'activo_variante_producto' => true,
                ]
            );

            // Crear el inventario correspondiente para la variante
            Inventario::updateOrCreate(
                [
                    'cod_producto' => $producto->cod_producto,
                    'cod_variante_producto' => $variante->cod_variante_producto,
                ],
                [
                    'stock_actual_inv' => $data['stock'],
                    'stock_minimo_inv' => 1,
                    'ubicacion_inv' => 'Almacén Demo A-1',
                    'activo_inv' => true,
                ]
            );
        }

        $this->command->info('Producto Jeans Earth Denim con variantes 30 (stock 5), 32 y 34 creado correctamente.');
    }
}
