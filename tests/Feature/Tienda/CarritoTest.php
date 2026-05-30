<?php

namespace Tests\Feature\Tienda;

use App\Models\CategoriaProducto;
use App\Models\Inventario;
use App\Models\Producto;

class CarritoTest extends TiendaTestCase
{

    private Producto $producto;
    private Inventario $inventario;

    protected function setUp(): void
    {
        parent::setUp();

        $categoria = CategoriaProducto::create([
            'nombre_cat' => 'Test',
            'activo_cat' => true,
        ]);

        $this->producto = Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Test',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'TEST-001',
            'estado_pro' => 'activo',
        ]);

        $this->inventario = Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'stock_actual_inv' => 10,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);
    }

    public function test_agregar_item_crea_carrito(): void
    {
        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'mensaje',
            'detalle',
            'carrito',
        ]);
    }

    public function test_agregar_producto_inactivo_falla(): void
    {
        $this->producto->update(['estado_pro' => 'inactivo']);

        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 1,
        ]);

        $response->assertStatus(422);
    }

    public function test_cantidad_mayor_a_stock_falla(): void
    {
        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 20,
        ]);

        $response->assertStatus(422);
    }

    public function test_actualizar_cantidad(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->patchJson('/tienda/carrito/items/' . $this->producto->cod_producto, [
            'cantidad' => 5,
        ]);

        $response->assertStatus(200);
    }

    public function test_eliminar_item(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->deleteJson('/tienda/carrito/items/' . $this->producto->cod_producto);

        $response->assertStatus(200);
    }

    public function test_vaciar_carrito(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->deleteJson('/tienda/carrito');

        $response->assertStatus(200);
    }
}
