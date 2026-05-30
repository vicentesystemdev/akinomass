<?php

namespace Tests\Feature\Tienda;

use App\Models\CategoriaProducto;
use App\Models\Inventario;
use App\Models\Producto;
use App\Models\User;

class CarritoMergeTest extends TiendaTestCase
{

    private Producto $producto1;
    private Producto $producto2;

    protected function setUp(): void
    {
        parent::setUp();

        $categoria = CategoriaProducto::create([
            'nombre_cat' => 'Test',
            'activo_cat' => true,
        ]);

        $this->producto1 = Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto 1',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'TEST-001',
            'estado_pro' => 'activo',
        ]);

        $this->producto2 = Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto 2',
            'precio_venta_pro' => 200.00,
            'sku_pro' => 'TEST-002',
            'estado_pro' => 'activo',
        ]);

        Inventario::create(['cod_producto' => $this->producto1->cod_producto, 'stock_actual_inv' => 10, 'activo_inv' => true]);
        Inventario::create(['cod_producto' => $this->producto2->cod_producto, 'stock_actual_inv' => 10, 'activo_inv' => true]);
    }

    public function test_guest_puede_agregar_items_sin_auth(): void
    {
        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto1->cod_producto,
            'cantidad' => 2,
        ]);

        $response->assertStatus(200);
    }

    public function test_usuario_logueado_ve_carrito_persistido(): void
    {
        $user = $this->crearUsuarioCliente();

        $this->actingAs($user)->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto1->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->actingAs($user)->getJson('/tienda/carrito');

        $response->assertStatus(200);
    }

    public function test_carrito_retorna_estructura_correcta(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto1->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->getJson('/tienda/carrito');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'carrito' => [
                'cod_carrito',
                'detalles',
            ],
        ]);
    }
}
