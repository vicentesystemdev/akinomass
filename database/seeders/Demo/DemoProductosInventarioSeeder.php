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
            ['nombre_cat' => 'Poleras', 'descripcion_cat' => 'Poleras básicas, estampadas y de corte oversize.', 'activo_cat' => true],
            ['nombre_cat' => 'Blusas', 'descripcion_cat' => 'Blusas elegantes, satinadas y casuales.', 'activo_cat' => true],
            ['nombre_cat' => 'Jeans', 'descripcion_cat' => 'Jeans mom fit, skinny, cargo y clásicos.', 'activo_cat' => true],
            ['nombre_cat' => 'Chamarras', 'descripcion_cat' => 'Chamarras de jean, rompevientos y abrigos.', 'activo_cat' => true],
            ['nombre_cat' => 'Vestidos', 'descripcion_cat' => 'Vestidos casuales, floreados y de noche.', 'activo_cat' => true],
            ['nombre_cat' => 'Faldas', 'descripcion_cat' => 'Faldas cortas, midi, plisadas y de mezclilla.', 'activo_cat' => true],
            ['nombre_cat' => 'Pantalones', 'descripcion_cat' => 'Pantalones casuales, de vestir y cargo.', 'activo_cat' => true],
            ['nombre_cat' => 'Conjuntos', 'descripcion_cat' => 'Conjuntos de dos piezas, deportivos y casuales.', 'activo_cat' => true],
            ['nombre_cat' => 'Accesorios', 'descripcion_cat' => 'Bufandas, cinturones, gorros y complementos.', 'activo_cat' => true],
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

        // Definimos los productos de ropa
        // NOTA: Para productos con variantes (como Jeans y Vestidos), el stock base es 0 ya que se controla por variante.
        $productosData = [
            [
                'nombre' => 'Polera Oversize Básica',
                'categoria' => 'Poleras',
                'precio' => 85,
                'costo' => 40,
                'sku' => 'ROPA-POL-001',
                'estado' => EstadoProductoEnum::ACTIVO->value,
                'stock' => 50,
                'stock_min' => 10,
                'descripcion' => 'Polera oversize de algodón 100% boliviano, cómoda y fresca.'
            ],
            [
                'nombre' => 'Jean Mom Fit Azul',
                'categoria' => 'Jeans',
                'precio' => 195,
                'costo' => 100,
                'sku' => 'ROPA-JEA-002',
                'estado' => EstadoProductoEnum::ACTIVO->value,
                'stock' => 0, // Controlado por variantes, base queda en 0.
                'stock_min' => 5,
                'descripcion' => 'Jean mom fit clásico de tiro alto, mezclilla resistente.'
            ],
            [
                'nombre' => 'Blusa Satinada Manga Larga',
                'categoria' => 'Blusas',
                'precio' => 130,
                'costo' => 65,
                'sku' => 'ROPA-BLU-003',
                'estado' => EstadoProductoEnum::ACTIVO->value,
                'stock' => 35,
                'stock_min' => 8,
                'descripcion' => 'Blusa de satén manga larga con botones de nácar.'
            ],
            [
                'nombre' => 'Chamarra Jean Clásica',
                'categoria' => 'Chamarras',
                'precio' => 220,
                'costo' => 110,
                'sku' => 'ROPA-CHA-004',
                'estado' => EstadoProductoEnum::ACTIVO->value,
                'stock' => 15,
                'stock_min' => 5,
                'descripcion' => 'Chamarra de mezclilla gruesa con bolsillos frontales.'
            ],
            [
                'nombre' => 'Vestido Casual Floreado',
                'categoria' => 'Vestidos',
                'precio' => 175,
                'costo' => 85,
                'sku' => 'ROPA-VES-005',
                'estado' => EstadoProductoEnum::ACTIVO->value,
                'stock' => 0, // Controlado por variantes, base queda en 0.
                'stock_min' => 4,
                'descripcion' => 'Vestido corto primaveral con estampado floreado y ajuste en cintura.'
            ],
            [
                'nombre' => 'Pantalón Cargo Mujer',
                'categoria' => 'Pantalones',
                'precio' => 185,
                'costo' => 95,
                'sku' => 'ROPA-PAN-006',
                'estado' => EstadoProductoEnum::ACTIVO->value,
                'stock' => 25,
                'stock_min' => 6,
                'descripcion' => 'Pantalón cargo de gabardina con múltiples bolsillos laterales.'
            ],
            [
                'nombre' => 'Conjunto Deportivo Urbano',
                'categoria' => 'Conjuntos',
                'precio' => 240,
                'costo' => 120,
                'sku' => 'ROPA-CON-007',
                'estado' => EstadoProductoEnum::ACTIVO->value,
                'stock' => 18,
                'stock_min' => 4,
                'descripcion' => 'Conjunto de dos piezas (polera y short) de frisa ligera.'
            ],
            [
                'nombre' => 'Falda Plisada Negra',
                'categoria' => 'Faldas',
                'precio' => 120,
                'costo' => 60,
                'sku' => 'ROPA-FAL-008',
                'estado' => EstadoProductoEnum::ACTIVO->value,
                'stock' => 30,
                'stock_min' => 5,
                'descripcion' => 'Falda midi plisada con pretina elástica.'
            ],
            [
                'nombre' => 'Top Básico Rib',
                'categoria' => 'Poleras',
                'precio' => 45,
                'costo' => 20,
                'sku' => 'ROPA-TOP-009',
                'estado' => EstadoProductoEnum::ACTIVO->value,
                'stock' => 45,
                'stock_min' => 10,
                'descripcion' => 'Top básico de tela acanalada (rib) con cuello redondo.'
            ],
            [
                'nombre' => 'Chamarra Rompeviento',
                'categoria' => 'Chamarras',
                'precio' => 160,
                'costo' => 75,
                'sku' => 'ROPA-ROM-010',
                'estado' => EstadoProductoEnum::AGOTADO->value, // Se colocará agotado para reportes de quiebre
                'stock' => 0,
                'stock_min' => 3,
                'descripcion' => 'Chamarra impermeable liviana con capucha ajustable.'
            ],
        ];

        foreach ($productosData as $productoData) {
            $producto = Producto::updateOrCreate(
                ['sku_pro' => $productoData['sku']],
                [
                    'cod_categoria_producto' => $categorias[$productoData['categoria']]->cod_categoria_producto,
                    'nombre_pro' => $productoData['nombre'],
                    'descripcion_pro' => $productoData['descripcion'],
                    'precio_venta_pro' => $productoData['precio'],
                    'precio_costo_pro' => $productoData['costo'],
                    'estado_pro' => $productoData['estado'],
                ],
            );

            Inventario::updateOrCreate(
                [
                    'cod_producto' => $producto->cod_producto,
                    'cod_variante_producto' => null,
                ],
                [
                    'stock_actual_inv' => $productoData['stock'],
                    'stock_minimo_inv' => $productoData['stock_min'],
                    'ubicacion_inv' => 'Almacén Central A-2',
                    'activo_inv' => true,
                ],
            );
        }
    }
}
