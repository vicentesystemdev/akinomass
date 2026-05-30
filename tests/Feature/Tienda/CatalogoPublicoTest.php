<?php

namespace Tests\Feature\Tienda;

use App\Models\CategoriaProducto;
use App\Models\Inventario;
use App\Models\Producto;

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

    public function test_detalle_producto_activo(): void
    {
        $response = $this->getJson('/tienda/productos/' . $this->producto->cod_producto);

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

    public function test_detalle_producto_inactivo_retorna_404(): void
    {
        $this->producto->update(['estado_pro' => 'inactivo']);

        $response = $this->getJson('/tienda/productos/' . $this->producto->cod_producto);

        $response->assertStatus(404);
    }

    public function test_filtro_por_categoria(): void
    {
        $response = $this->getJson('/tienda/catalogo?cod_categoria_producto=' . $this->categoria->cod_categoria_producto);

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

        $response = $this->getJson('/tienda/productos/' . $this->producto->cod_producto);

        $response->assertStatus(200);
        $response->assertJsonMissing(['precio_costo_pro']);
    }
}
