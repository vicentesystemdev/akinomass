<?php

namespace Database\Seeders\Demo;

use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use App\Models\CategoriaProducto;
use App\Models\Inventario;
use App\Models\Producto;
use Illuminate\Database\Seeder;

class DemoProductosInventarioSeeder extends Seeder
{
    public function run(): void
    {
        $categoriasData = [
            ['nombre_cat' => 'Iluminación', 'descripcion_cat' => 'Productos de iluminación para transmisiones.', 'activo_cat' => true],
            ['nombre_cat' => 'Audio', 'descripcion_cat' => 'Micrófonos y accesorios de audio.', 'activo_cat' => true],
            ['nombre_cat' => 'Soportes', 'descripcion_cat' => 'Trípodes, bases y soportes para equipos.', 'activo_cat' => true],
            ['nombre_cat' => 'Kits', 'descripcion_cat' => 'Combos de productos para streaming.', 'activo_cat' => true],
        ];

        $categorias = [];
        foreach ($categoriasData as $categoriaData) {
            $categoria = CategoriaProducto::updateOrCreate(
                ['nombre_cat' => $categoriaData['nombre_cat']],
                [
                    'descripcion_cat' => $categoriaData['descripcion_cat'],
                    'activo_cat' => $categoriaData['activo_cat'],
                ],
            );
            $categorias[$categoriaData['nombre_cat']] = $categoria;
        }

        $productosData = [
            ['nombre' => 'Aro de luz 10"', 'categoria' => 'Iluminación', 'precio' => 120, 'costo' => 78, 'sku' => 'DEMO-ILU-001', 'estado' => EstadoProductoEnum::ACTIVO->value, 'stock' => 25, 'stock_min' => 5],
            ['nombre' => 'Aro de luz 18"', 'categoria' => 'Iluminación', 'precio' => 280, 'costo' => 190, 'sku' => 'DEMO-ILU-002', 'estado' => EstadoProductoEnum::ACTIVO->value, 'stock' => 3, 'stock_min' => 5],
            ['nombre' => 'Panel LED portátil', 'categoria' => 'Iluminación', 'precio' => 210, 'costo' => 145, 'sku' => 'DEMO-ILU-003', 'estado' => EstadoProductoEnum::AGOTADO->value, 'stock' => 0, 'stock_min' => 4],
            ['nombre' => 'Micrófono inalámbrico dual', 'categoria' => 'Audio', 'precio' => 330, 'costo' => 230, 'sku' => 'DEMO-AUD-001', 'estado' => EstadoProductoEnum::ACTIVO->value, 'stock' => 12, 'stock_min' => 4],
            ['nombre' => 'Micrófono USB condensador', 'categoria' => 'Audio', 'precio' => 260, 'costo' => 170, 'sku' => 'DEMO-AUD-002', 'estado' => EstadoProductoEnum::ACTIVO->value, 'stock' => 2, 'stock_min' => 3],
            ['nombre' => 'Trípode profesional 2m', 'categoria' => 'Soportes', 'precio' => 190, 'costo' => 120, 'sku' => 'DEMO-SOP-001', 'estado' => EstadoProductoEnum::ACTIVO->value, 'stock' => 15, 'stock_min' => 4],
            ['nombre' => 'Soporte de celular flexible', 'categoria' => 'Soportes', 'precio' => 80, 'costo' => 40, 'sku' => 'DEMO-SOP-002', 'estado' => EstadoProductoEnum::ACTIVO->value, 'stock' => 30, 'stock_min' => 8],
            ['nombre' => 'Brazo articulado para micrófono', 'categoria' => 'Soportes', 'precio' => 110, 'costo' => 65, 'sku' => 'DEMO-SOP-003', 'estado' => EstadoProductoEnum::INACTIVO->value, 'stock' => 6, 'stock_min' => 2],
            ['nombre' => 'Kit streaming básico', 'categoria' => 'Kits', 'precio' => 520, 'costo' => 360, 'sku' => 'DEMO-KIT-001', 'estado' => EstadoProductoEnum::ACTIVO->value, 'stock' => 9, 'stock_min' => 3],
            ['nombre' => 'Kit streaming avanzado', 'categoria' => 'Kits', 'precio' => 890, 'costo' => 620, 'sku' => 'DEMO-KIT-002', 'estado' => EstadoProductoEnum::ACTIVO->value, 'stock' => 1, 'stock_min' => 2],
        ];

        foreach ($productosData as $productoData) {
            $producto = Producto::updateOrCreate(
                ['sku_pro' => $productoData['sku']],
                [
                    'cod_categoria_producto' => $categorias[$productoData['categoria']]->cod_categoria_producto,
                    'nombre_pro' => $productoData['nombre'],
                    'descripcion_pro' => 'Producto de demostración para escenarios comerciales de AKINOMASS.',
                    'precio_venta_pro' => $productoData['precio'],
                    'precio_costo_pro' => $productoData['costo'],
                    'estado_pro' => $productoData['estado'],
                ],
            );

            Inventario::updateOrCreate(
                ['cod_producto' => $producto->cod_producto],
                [
                    'stock_actual_inv' => $productoData['stock'],
                    'stock_minimo_inv' => $productoData['stock_min'],
                    'ubicacion_inv' => 'Almacén Demo A-1',
                    'activo_inv' => true,
                ],
            );
        }
    }
}
