<?php

namespace Tests\Feature\Tienda;

use App\Models\Carrito;
use App\Models\CategoriaProducto;
use App\Models\Inventario;
use App\Models\Producto;
use App\Models\ReservaStockCarrito;
use App\Models\TallaProducto;
use App\Models\VarianteProducto;

class CatalogoPublicoTest extends TiendaTestCase
{
    private CategoriaProducto $categoria;

    private Producto $producto;

    protected function setUp(): void
    {
        parent::setUp();

        $this->categoria = CategoriaProducto::create([
            'nombre_cat' => 'Electrónica',
            'activo_cat' => true,
        ]);

        $this->producto = Producto::create([
            'cod_categoria_producto' => $this->categoria->cod_categoria_producto,
            'nombre_pro' => 'Laptop Test',
            'precio_venta_pro' => 5000.00,
            'sku_pro' => 'LAP-001',
            'estado_pro' => 'activo',
        ]);

        Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'stock_actual_inv' => 5,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);
    }

    public function test_catalogo_publico_accesible_sin_auth(): void
    {
        $response = $this->getJson('/tienda/catalogo');

        $response->assertStatus(200);
    }

    public function test_listar_productos_activos(): void
    {
        $response = $this->getJson('/tienda/catalogo');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'productos' => [
                'data' => [
                    '*' => [
                        'cod_producto',
                        'nombre_pro',
                        'precio_venta_pro',
                    ],
                ],
            ],
        ]);
    }

    public function test_producto_inactivo_no_aparece(): void
    {
        $this->producto->update(['estado_pro' => 'inactivo']);

        $response = $this->getJson('/tienda/catalogo');

        $response->assertStatus(200);
        $productos = collect($response->json('productos.data'));
        $this->assertTrue($productos->isEmpty());
    }

    public function test_producto_de_categoria_inactiva_no_aparece(): void
    {
        $this->categoria->update(['activo_cat' => false]);

        $response = $this->getJson('/tienda/catalogo');

        $response->assertOk();
        $this->assertTrue(collect($response->json('productos.data'))->isEmpty());
    }

    public function test_detalle_producto_activo(): void
    {
        $response = $this->getJson('/tienda/productos/'.$this->producto->cod_producto);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'producto' => [
                'cod_producto',
                'nombre_pro',
                'precio_venta_pro',
                'stock_disponible',
                'disponible',
            ],
        ]);
    }

    public function test_detalle_producto_expone_variantes_activas_para_lectura(): void
    {
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'UNICA',
            'nom_talla_producto' => 'Única',
            'tipo_talla_producto' => 'general',
            'orden_talla_producto' => 1000,
            'activo_talla_producto' => true,
        ]);
        $this->producto->variantes()->create([
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'LAP-001-UNICA',
        ]);

        $response = $this->getJson('/tienda/productos/'.$this->producto->cod_producto);

        $response->assertOk();
        $response->assertJsonPath('producto.variantes.0.talla.codigo_talla_producto', 'UNICA');
    }

    public function test_detalle_producto_inactivo_retorna_404(): void
    {
        $this->producto->update(['estado_pro' => 'inactivo']);

        $response = $this->getJson('/tienda/productos/'.$this->producto->cod_producto);

        $response->assertStatus(404);
    }

    public function test_detalle_producto_de_categoria_inactiva_retorna_404(): void
    {
        $this->categoria->update(['activo_cat' => false]);

        $response = $this->getJson('/tienda/productos/'.$this->producto->cod_producto);

        $response->assertNotFound();
    }

    public function test_filtro_por_categoria(): void
    {
        $response = $this->getJson('/tienda/catalogo?cod_categoria_producto='.$this->categoria->cod_categoria_producto);

        $response->assertStatus(200);
    }

    public function test_filtro_busqueda(): void
    {
        $response = $this->getJson('/tienda/catalogo?q=Laptop');

        $response->assertStatus(200);
    }

    public function test_precio_costo_no_expuesto(): void
    {
        $this->producto->update(['precio_costo_pro' => 3000.00]);

        $response = $this->getJson('/tienda/productos/'.$this->producto->cod_producto);

        $response->assertStatus(200);
        $response->assertJsonMissing(['precio_costo_pro']);
    }

    public function test_solo_disponibles_excluye_producto_con_todo_el_stock_reservado(): void
    {
        ReservaStockCarrito::create([
            'cod_carrito' => Carrito::create([
                'session_id_car' => 'catalogo-reservas',
                'estado_car' => 'activo',
            ])->cod_carrito,
            'cod_producto' => $this->producto->cod_producto,
            'session_id_res' => 'catalogo-reservas',
            'cantidad_res' => 5,
            'estado_res' => 'activa',
            'expira_en_res' => now()->addMinutes(20),
        ]);

        $response = $this->getJson('/tienda/catalogo?solo_disponibles=1');

        $response->assertOk();
        $this->assertTrue(collect($response->json('productos.data'))->isEmpty());
    }

    public function test_filtro_por_talla_muestra_solo_productos_con_esa_talla(): void
    {
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'M',
            'nom_talla_producto' => 'Mediano',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 2,
            'activo_talla_producto' => true,
        ]);

        $variante = VarianteProducto::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'LAP-001-M',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);

        Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'stock_actual_inv' => 3,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        $otroProducto = Producto::create([
            'cod_categoria_producto' => $this->categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Sin Talla M',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'SIN-M-001',
            'estado_pro' => 'activo',
        ]);
        Inventario::create([
            'cod_producto' => $otroProducto->cod_producto,
            'stock_actual_inv' => 5,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        $response = $this->getJson('/tienda/catalogo?cod_talla_producto='.$talla->cod_talla_producto);

        $response->assertOk();
        $codigos = collect($response->json('productos.data'))->pluck('cod_producto');
        $this->assertTrue($codigos->contains($this->producto->cod_producto));
        $this->assertFalse($codigos->contains($otroProducto->cod_producto));
    }

    public function test_filtro_por_categoria_y_talla_se_puede_combinar(): void
    {
        $otraCategoria = CategoriaProducto::create([
            'nombre_cat' => 'Otra categorÃ­a',
            'activo_cat' => true,
        ]);
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'S',
            'nom_talla_producto' => 'Small',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 1,
            'activo_talla_producto' => true,
        ]);

        $variante = VarianteProducto::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'LAP-001-S',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);
        Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'stock_actual_inv' => 2,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        $otroProducto = Producto::create([
            'cod_categoria_producto' => $otraCategoria->cod_categoria_producto,
            'nombre_pro' => 'Producto otra categorÃ­a',
            'precio_venta_pro' => 200.00,
            'sku_pro' => 'OTRA-S',
            'estado_pro' => 'activo',
        ]);
        $otraVariante = VarianteProducto::create([
            'cod_producto' => $otroProducto->cod_producto,
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'OTRA-S-V',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);
        Inventario::create([
            'cod_producto' => $otroProducto->cod_producto,
            'cod_variante_producto' => $otraVariante->cod_variante_producto,
            'stock_actual_inv' => 2,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        $response = $this->getJson('/tienda/catalogo?cod_categoria_producto='.$this->categoria->cod_categoria_producto.'&cod_talla_producto='.$talla->cod_talla_producto);

        $response->assertOk();
        $codigos = collect($response->json('productos.data'))->pluck('cod_producto');
        $this->assertTrue($codigos->contains($this->producto->cod_producto));
        $this->assertFalse($codigos->contains($otroProducto->cod_producto));
    }

    public function test_filtro_por_talla_inexistente_no_trae_productos(): void
    {
        $response = $this->getJson('/tienda/catalogo?cod_talla_producto=999999');

        $response->assertStatus(422);
    }

    public function test_catalogo_expone_tallas_disponibles(): void
    {
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'L',
            'nom_talla_producto' => 'Grande',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 3,
            'activo_talla_producto' => true,
        ]);

        $variante = VarianteProducto::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'LAP-001-L',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);

        Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'stock_actual_inv' => 2,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        $response = $this->getJson('/tienda/catalogo');

        $response->assertOk();
        $tallas = $response->json('tallas');
        $this->assertNotNull($tallas);
        $codigos = collect($tallas)->pluck('codigo_talla_producto');
        $this->assertTrue($codigos->contains('L'));
    }

    public function test_variante_agotada_aparece_con_disponible_false(): void
    {
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'XL',
            'nom_talla_producto' => 'Extra Grande',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 4,
            'activo_talla_producto' => true,
        ]);

        $variante = VarianteProducto::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'LAP-001-XL',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);

        Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'stock_actual_inv' => 0,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        $response = $this->getJson('/tienda/productos/'.$this->producto->cod_producto);

        $response->assertOk();
        $variantes = $response->json('producto.variantes');
        $varianteData = collect($variantes)->firstWhere('cod_variante_producto', $variante->cod_variante_producto);
        $this->assertFalse($varianteData['disponible']);
        $this->assertEquals('agotado', $varianteData['stock_badge']);
    }

    public function test_producto_sin_variantes_sigue_apareciendo_sin_filtro_talla(): void
    {
        $response = $this->getJson('/tienda/catalogo');

        $response->assertOk();
        $codigos = collect($response->json('productos.data'))->pluck('cod_producto');
        $this->assertTrue($codigos->contains($this->producto->cod_producto));
    }

    public function test_stock_badge_ultimo_stock_cuando_stock_igual_minimo(): void
    {
        Inventario::where('cod_producto', $this->producto->cod_producto)
            ->whereNull('cod_variante_producto')
            ->update(['stock_actual_inv' => 1, 'stock_minimo_inv' => 1]);

        $response = $this->getJson('/tienda/catalogo');

        $response->assertOk();
        $productoData = collect($response->json('productos.data'))
            ->firstWhere('cod_producto', $this->producto->cod_producto);
        $this->assertEquals('ultimo_stock', $productoData['stock_badge']);
    }

    public function test_solo_disponibles_ignora_reservas_vencidas(): void
    {
        ReservaStockCarrito::create([
            'cod_carrito' => Carrito::create([
                'session_id_car' => 'catalogo-reserva-vencida',
                'estado_car' => 'activo',
            ])->cod_carrito,
            'cod_producto' => $this->producto->cod_producto,
            'session_id_res' => 'catalogo-reserva-vencida',
            'cantidad_res' => 5,
            'estado_res' => 'activa',
            'expira_en_res' => now()->subMinute(),
        ]);

        $response = $this->getJson('/tienda/catalogo?solo_disponibles=1');

        $response->assertOk();
        $this->assertCount(1, $response->json('productos.data'));
    }
}
