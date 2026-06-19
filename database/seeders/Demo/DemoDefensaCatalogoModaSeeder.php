<?php

namespace Database\Seeders\Demo;

use App\Models\CategoriaProducto;
use App\Models\Producto;
use App\Models\TallaProducto;
use App\Models\VarianteProducto;
use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use Illuminate\Database\Seeder;

class DemoDefensaCatalogoModaSeeder extends Seeder
{
    public function run(): void
    {
        $categoriasData = [
            'Jeans cargo' => 'Jeans con múltiples bolsillos, estilo urbano y resistente.',
            'Poleras oversize' => 'Poleras holgadas de algodón con cortes modernos y estampados.',
            'Blusas' => 'Blusas casuales y elegantes de gasa, lino y satén.',
            'Vestidos' => 'Vestidos primaverales, de noche, cortos y largos.',
            'Chamarras' => 'Chamarras de mezclilla, térmicas e impermeables.',
            'Conjuntos deportivos' => 'Conjuntos cómodos de dos piezas para actividad física o descanso.',
            'Faldas' => 'Faldas cortas, midi, tableadas y plisadas.',
            'Pantalones' => 'Pantalones de vestir, chinos, wide leg y joggers.',
            'Accesorios' => 'Gorras, cinturones, bolsos pequeños y complementos.',
            'Prendas en liquidación' => 'Saldos y productos de temporadas pasadas a precio de liquidación.',
        ];

        $categorias = [];
        foreach ($categoriasData as $nombre => $descripcion) {
            $categorias[$nombre] = CategoriaProducto::updateOrCreate(
                ['nombre_cat' => $nombre],
                [
                    'descripcion_cat' => $descripcion,
                    'activo_cat' => true,
                ]
            );
        }

        // Definimos los 50 productos
        $productosConfig = [
            // 1. Jeans cargo (tallas pantalon)
            ['cat' => 'Jeans cargo', 'nom' => 'Jeans cargo clásico celeste', 'price' => 190.0, 'cost' => 90.0, 'sku' => 'JC-01', 'desc' => 'Jean cargo clásico de mezclilla gruesa celeste con bolsillos laterales.'],
            ['cat' => 'Jeans cargo', 'nom' => 'Jeans cargo vintage gris', 'price' => 200.0, 'cost' => 95.0, 'sku' => 'JC-02', 'desc' => 'Jean cargo lavado estilo vintage gris oscuro muy resistente.'],
            ['cat' => 'Jeans cargo', 'nom' => 'Jeans cargo urbano negro', 'price' => 210.0, 'cost' => 100.0, 'sku' => 'JC-03', 'desc' => 'Jean cargo negro entallado de gabardina suave.'],
            ['cat' => 'Jeans cargo', 'nom' => 'Jeans cargo militar verde', 'price' => 220.0, 'cost' => 110.0, 'sku' => 'JC-04', 'desc' => 'Jean cargo camuflado verde militar con cordón de ajuste.'],
            ['cat' => 'Jeans cargo', 'nom' => 'Jeans cargo premium azul', 'price' => 240.0, 'cost' => 120.0, 'sku' => 'JC-05', 'desc' => 'Jean cargo premium con costuras reforzadas e hilo contrastante.'],

            // 2. Poleras oversize (tallas ropa)
            ['cat' => 'Poleras oversize', 'nom' => 'Polera oversize básica blanca', 'price' => 80.0, 'cost' => 35.0, 'sku' => 'PO-01', 'desc' => 'Polera oversize blanca lisa de algodón 100% boliviano.'],
            ['cat' => 'Poleras oversize', 'nom' => 'Polera oversize gráfica anime', 'price' => 90.0, 'cost' => 40.0, 'sku' => 'PO-02', 'desc' => 'Polera oversize negra con estampado gráfico anime en espalda.'],
            ['cat' => 'Poleras oversize', 'nom' => 'Polera oversize retro beige', 'price' => 85.0, 'cost' => 38.0, 'sku' => 'PO-03', 'desc' => 'Polera oversize color beige de corte clásico retro.'],
            ['cat' => 'Poleras oversize', 'nom' => 'Polera oversize vintage lavada', 'price' => 100.0, 'cost' => 45.0, 'sku' => 'PO-04', 'desc' => 'Polera oversize con textura desgastada color carbón.'],
            ['cat' => 'Poleras oversize', 'nom' => 'Polera oversize street negra', 'price' => 95.0, 'cost' => 42.0, 'sku' => 'PO-05', 'desc' => 'Polera oversize negra pesada con tipografía urbana en pecho.'],

            // 3. Blusas (tallas ropa)
            ['cat' => 'Blusas', 'nom' => 'Blusa satinada elegante', 'price' => 130.0, 'cost' => 60.0, 'sku' => 'BL-01', 'desc' => 'Blusa elegante de satén brillante manga larga.'],
            ['cat' => 'Blusas', 'nom' => 'Blusa casual lino blanca', 'price' => 110.0, 'cost' => 50.0, 'sku' => 'BL-02', 'desc' => 'Blusa fresca de lino ideal para el día a día.'],
            ['cat' => 'Blusas', 'nom' => 'Blusa flores primavera', 'price' => 120.0, 'cost' => 55.0, 'sku' => 'BL-03', 'desc' => 'Blusa estampada con motivos florales de gasa ligera.'],
            ['cat' => 'Blusas', 'nom' => 'Blusa hombros descubiertos', 'price' => 125.0, 'cost' => 58.0, 'sku' => 'BL-04', 'desc' => 'Blusa con diseño off-shoulder y encaje fino.'],
            ['cat' => 'Blusas', 'nom' => 'Blusa formal gasa', 'price' => 140.0, 'cost' => 65.0, 'sku' => 'BL-05', 'desc' => 'Blusa formal de cuello camisero y manga regulable.'],

            // 4. Vestidos (tallas ropa)
            ['cat' => 'Vestidos', 'nom' => 'Vestido casual corto flores', 'price' => 160.0, 'cost' => 75.0, 'sku' => 'VE-01', 'desc' => 'Vestido corto primaveral con lazo en cintura.'],
            ['cat' => 'Vestidos', 'nom' => 'Vestido de noche elegante', 'price' => 280.0, 'cost' => 130.0, 'sku' => 'VE-02', 'desc' => 'Vestido largo de satén con abertura lateral para eventos.'],
            ['cat' => 'Vestidos', 'nom' => 'Vestido playero lino', 'price' => 150.0, 'cost' => 70.0, 'sku' => 'VE-03', 'desc' => 'Vestido holgado de lino con botones de madera.'],
            ['cat' => 'Vestidos', 'nom' => 'Vestido camisero mezclilla', 'price' => 180.0, 'cost' => 85.0, 'sku' => 'VE-04', 'desc' => 'Vestido camisero clásico de mezclilla fina con cinturón.'],
            ['cat' => 'Vestidos', 'nom' => 'Vestido midi punto', 'price' => 190.0, 'cost' => 90.0, 'sku' => 'VE-05', 'desc' => 'Vestido de punto acanalado largo medio entallado.'],

            // 5. Chamarras (tallas ropa)
            ['cat' => 'Chamarras', 'nom' => 'Chamarra denim clásica', 'price' => 240.0, 'cost' => 110.0, 'sku' => 'CH-01', 'desc' => 'Chamarra de mezclilla azul clásico con bolsillos frontales.'],
            ['cat' => 'Chamarras', 'nom' => 'Chamarra térmica plumas', 'price' => 350.0, 'cost' => 160.0, 'sku' => 'CH-02', 'desc' => 'Chamarra térmica acolchada ultraliviana para el invierno.'],
            ['cat' => 'Chamarras', 'nom' => 'Chamarra rompevientos urban', 'price' => 180.0, 'cost' => 80.0, 'sku' => 'CH-03', 'desc' => 'Chamarra impermeable delgada con capucha.'],
            ['cat' => 'Chamarras', 'nom' => 'Chamarra aviadora gamuza', 'price' => 380.0, 'cost' => 180.0, 'sku' => 'CH-04', 'desc' => 'Chamarra estilo aviador de gamuza con forro de corderito.'],
            ['cat' => 'Chamarras', 'nom' => 'Chamarra bomber impermeable', 'price' => 220.0, 'cost' => 100.0, 'sku' => 'CH-05', 'desc' => 'Chamarra bomber clásica con forro contrastante.'],

            // 6. Conjuntos deportivos (tallas ropa)
            ['cat' => 'Conjuntos deportivos', 'nom' => 'Conjunto deportivo fleece gris', 'price' => 250.0, 'cost' => 120.0, 'sku' => 'CD-01', 'desc' => 'Conjunto de sudadera y pantalón de algodón frizado.'],
            ['cat' => 'Conjuntos deportivos', 'nom' => 'Conjunto deportivo corto verano', 'price' => 180.0, 'cost' => 85.0, 'sku' => 'CD-02', 'desc' => 'Conjunto de top y short elásticos para entrenamiento.'],
            ['cat' => 'Conjuntos deportivos', 'nom' => 'Conjunto yoga licra dama', 'price' => 210.0, 'cost' => 100.0, 'sku' => 'CD-03', 'desc' => 'Conjunto sin costuras de calza larga y top deportivo.'],
            ['cat' => 'Conjuntos deportivos', 'nom' => 'Conjunto running rompeviento', 'price' => 280.0, 'cost' => 130.0, 'sku' => 'CD-04', 'desc' => 'Conjunto de pantalón y casaca impermeable delgada.'],
            ['cat' => 'Conjuntos deportivos', 'nom' => 'Conjunto sport casual negro', 'price' => 240.0, 'cost' => 110.0, 'sku' => 'CD-05', 'desc' => 'Conjunto negro de algodón rústico de dos piezas.'],

            // 7. Faldas (tallas ropa)
            ['cat' => 'Faldas', 'nom' => 'Falda tableada colegiala', 'price' => 120.0, 'cost' => 55.0, 'sku' => 'FA-01', 'desc' => 'Falda corta tableada de sarga estilo colegial.'],
            ['cat' => 'Faldas', 'nom' => 'Falda midi mezclilla', 'price' => 150.0, 'cost' => 70.0, 'sku' => 'FA-02', 'desc' => 'Falda de jean largo medio con corte frontal.'],
            ['cat' => 'Faldas', 'nom' => 'Falda cuero sintético negra', 'price' => 140.0, 'cost' => 65.0, 'sku' => 'FA-03', 'desc' => 'Falda corta tubo de ecocuero negro.'],
            ['cat' => 'Faldas', 'nom' => 'Falda corta cargo', 'price' => 130.0, 'cost' => 60.0, 'sku' => 'FA-04', 'desc' => 'Falda corta estilo cargo de gabardina.'],
            ['cat' => 'Faldas', 'nom' => 'Falda plisada satinada', 'price' => 145.0, 'cost' => 68.0, 'sku' => 'FA-05', 'desc' => 'Falda larga plisada de satén fluido.'],

            // 8. Pantalones (tallas pantalon)
            ['cat' => 'Pantalones', 'nom' => 'Pantalón wide leg sastrero', 'price' => 170.0, 'cost' => 80.0, 'sku' => 'PA-01', 'desc' => 'Pantalón sastrero de tiro alto y pierna ancha.'],
            ['cat' => 'Pantalones', 'nom' => 'Pantalón jogger gabardina', 'price' => 150.0, 'cost' => 70.0, 'sku' => 'PA-02', 'desc' => 'Pantalón jogger cómodo de gabardina con puños.'],
            ['cat' => 'Pantalones', 'nom' => 'Pantalón palazzo lino', 'price' => 160.0, 'cost' => 75.0, 'sku' => 'PA-03', 'desc' => 'Pantalón palazzo suelto de lino rústico.'],
            ['cat' => 'Pantalones', 'nom' => 'Pantalón pitillo bengalina', 'price' => 140.0, 'cost' => 65.0, 'sku' => 'PA-04', 'desc' => 'Pantalón súper elástico entallado de tiro alto.'],
            ['cat' => 'Pantalones', 'nom' => 'Pantalón cargo clásico', 'price' => 180.0, 'cost' => 85.0, 'sku' => 'PA-05', 'desc' => 'Pantalón cargo recto de gabardina duradera.'],

            // 9. Accesorios (talla UNICA)
            ['cat' => 'Accesorios', 'nom' => 'Cinturón casual cuero', 'price' => 45.0, 'cost' => 20.0, 'sku' => 'AC-01', 'desc' => 'Cinturón de cuero vacuno legítimo con hebilla plateada.'],
            ['cat' => 'Accesorios', 'nom' => 'Gorra urbana bordada', 'price' => 60.0, 'cost' => 25.0, 'sku' => 'AC-02', 'desc' => 'Gorra de béisbol con logo urbano bordado al frente.'],
            ['cat' => 'Accesorios', 'nom' => 'Bolso pequeño cruzado', 'price' => 80.0, 'cost' => 35.0, 'sku' => 'AC-03', 'desc' => 'Carro bandolero pequeño de ecocuero con correa regulable.'],
            ['cat' => 'Accesorios', 'nom' => 'Gafas de sol retro', 'price' => 50.0, 'cost' => 22.0, 'sku' => 'AC-04', 'desc' => 'Gafas de sol con protección UV400 y marco de pasta retro.'],
            ['cat' => 'Accesorios', 'nom' => 'Medias deportivas pack 3', 'price' => 25.0, 'cost' => 10.0, 'sku' => 'AC-05', 'desc' => 'Pack de tres pares de medias de algodón con soporte.'],

            // 10. Prendas en liquidación
            ['cat' => 'Prendas en liquidación', 'nom' => 'Vestido temporada pasada', 'price' => 90.0, 'cost' => 70.0, 'sku' => 'LI-01', 'desc' => 'Vestido de verano temporada anterior, saldo final.'],
            ['cat' => 'Prendas en liquidación', 'nom' => 'Polera básica oferta', 'price' => 40.0, 'cost' => 30.0, 'sku' => 'LI-02', 'desc' => 'Polera clásica blanca saldo de liquidación.'],
            ['cat' => 'Prendas en liquidación', 'nom' => 'Jeans descontinuados outlet', 'price' => 100.0, 'cost' => 80.0, 'sku' => 'LI-03', 'desc' => 'Jeans mom fit fuera de stock clásico, saldos.'],
            ['cat' => 'Prendas en liquidación', 'nom' => 'Chamarra ligera saldo', 'price' => 120.0, 'cost' => 90.0, 'sku' => 'LI-04', 'desc' => 'Chamarra de media estación en liquidación final.'],
            ['cat' => 'Prendas en liquidación', 'nom' => 'Blusa outlet saldo', 'price' => 60.0, 'cost' => 45.0, 'sku' => 'LI-05', 'desc' => 'Blusa sin mangas de lino en liquidación de stock.'],
        ];

        // Tallas precargadas en el sistema
        $tallasRopa = TallaProducto::where('tipo_talla_producto', 'ropa')->get();
        $tallasPantalon = TallaProducto::where('tipo_talla_producto', 'pantalon')->get();
        $tallaUnica = TallaProducto::where('codigo_talla_producto', 'UNICA')->get();

        foreach ($productosConfig as $pConf) {
            $cat = $categorias[$pConf['cat']];
            $producto = Producto::updateOrCreate(
                ['sku_pro' => $pConf['sku']],
                [
                    'cod_categoria_producto' => $cat->cod_categoria_producto,
                    'nombre_pro' => $pConf['nom'],
                    'descripcion_pro' => $pConf['desc'],
                    'precio_venta_pro' => $pConf['price'],
                    'precio_costo_pro' => $pConf['cost'],
                    'estado_pro' => EstadoProductoEnum::ACTIVO->value,
                ]
            );

            // Determinar qué tallas aplicar
            if ($pConf['cat'] === 'Jeans cargo' || $pConf['cat'] === 'Pantalones' || ($pConf['cat'] === 'Prendas en liquidación' && $pConf['sku'] === 'LI-03')) {
                $tallas = $tallasPantalon;
            } elseif ($pConf['cat'] === 'Accesorios') {
                $tallas = $tallaUnica;
            } else {
                $tallas = $tallasRopa;
            }

            // Crear variantes de producto
            foreach ($tallas as $talla) {
                VarianteProducto::updateOrCreate(
                    [
                        'cod_producto' => $producto->cod_producto,
                        'cod_talla_producto' => $talla->cod_talla_producto,
                    ],
                    [
                        'sku_variante_producto' => $pConf['sku'] . '-' . $talla->codigo_talla_producto,
                        'precio_venta_variante' => $pConf['price'],
                        'estado_variante_producto' => 'activo',
                        'activo_variante_producto' => true,
                    ]
                );
            }
        }
    }
}
