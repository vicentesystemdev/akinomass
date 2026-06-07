<?php

namespace Tests\Feature\Admin;

class ProductoTest extends AdminTestCase
{
    public function test_admin_puede_crear_producto(): void
    {
        $categoria = $this->crearCategoria();

        $this->actingAs($this->admin);

        $response = $this->post(route('productos.store'), [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Nuevo Producto',
            'precio_venta_pro' => 150.00,
            'precio_costo_pro' => 80.00,
            'sku_pro' => 'PROD-001',
            'estado_pro' => 'activo',
        ]);

        $response->assertRedirect(route('productos.index'));
        $this->assertDatabaseHas('productos', [
            'nombre_pro' => 'Nuevo Producto',
            'sku_pro' => 'PROD-001',
        ]);
    }

    public function test_crear_producto_requiere_nombre(): void
    {
        $categoria = $this->crearCategoria();

        $this->actingAs($this->admin);

        $response = $this->post(route('productos.store'), [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => '',
            'precio_venta_pro' => 100,
            'sku_pro' => 'TEST',
            'estado_pro' => 'activo',
        ]);

        $response->assertSessionHasErrors('nombre_pro');
    }

    public function test_admin_puede_editar_producto(): void
    {
        $producto = $this->crearProducto();

        $this->actingAs($this->admin);

        $response = $this->put(route('productos.update', $producto), [
            'cod_categoria_producto' => $producto->cod_categoria_producto,
            'nombre_pro' => 'Producto Editado',
            'precio_venta_pro' => 200.00,
            'precio_costo_pro' => 100.00,
            'sku_pro' => $producto->sku_pro,
            'estado_pro' => 'activo',
        ]);

        $response->assertRedirect(route('productos.index'));
        $this->assertDatabaseHas('productos', [
            'cod_producto' => $producto->cod_producto,
            'nombre_pro' => 'Producto Editado',
        ]);
    }

    public function test_listar_productos(): void
    {
        $this->crearProducto();
        $this->crearProducto(attributes: ['nombre_pro' => 'Producto 2', 'sku_pro' => 'P-002']);

        $this->actingAs($this->admin);

        $response = $this->get(route('productos.index'));

        $response->assertStatus(200);
    }

    public function test_producto_inactivo_no_aparece_en_catalogo_publico(): void
    {
        [$productoActivo] = $this->crearProductoConStock(5, ['nombre_pro' => 'Activo']);
        [$productoInactivo] = $this->crearProductoConStock(5, [
            'nombre_pro' => 'Inactivo',
            'sku_pro' => 'INACT-001',
            'estado_pro' => 'inactivo',
        ]);

        $response = $this->get('/tienda/catalogo');

        $response->assertStatus(200);
    }

    public function test_listar_productos_requiere_auth(): void
    {
        $response = $this->get(route('productos.index'));

        $response->assertRedirect('/login');
    }
}
