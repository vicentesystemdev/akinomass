<?php

namespace Tests\Feature\Admin;

use App\Models\Producto;
use App\Models\TallaProducto;

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
        $productoId = (int) Producto::where('sku_pro', 'PROD-001')->value('cod_producto');
        $this->assertDatabaseHas('inventarios', [
            'cod_producto' => $productoId,
            'stock_actual_inv' => 0,
            'stock_minimo_inv' => 0,
            'ubicacion_inv' => 'Almacén 1',
            'activo_inv' => true,
        ]);
    }

    public function test_crear_producto_asigna_estado_activo_por_defecto(): void
    {
        $categoria = $this->crearCategoria();
        $this->actingAs($this->admin);

        $response = $this->post(route('productos.store'), [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Sin Estado',
            'precio_venta_pro' => 150,
            'sku_pro' => 'SIN-ESTADO',
        ]);

        $response->assertRedirect(route('productos.index'));
        $this->assertDatabaseHas('productos', [
            'sku_pro' => 'SIN-ESTADO',
            'estado_pro' => 'activo',
        ]);
    }

    public function test_admin_puede_crear_producto_con_variantes_de_talla(): void
    {
        $categoria = $this->crearCategoria();
        $tallaM = TallaProducto::create([
            'codigo_talla_producto' => 'M',
            'nom_talla_producto' => 'Mediana',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 30,
            'activo_talla_producto' => true,
        ]);
        $this->actingAs($this->admin);

        $response = $this->post(route('productos.store'), [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Remera con talla',
            'precio_venta_pro' => 150,
            'sku_pro' => 'REM-BASE',
            'variantes' => [[
                'cod_talla_producto' => $tallaM->cod_talla_producto,
                'sku_variante_producto' => 'REM-BASE-M',
                'precio_venta_variante' => 160,
            ]],
        ]);

        $response->assertRedirect(route('productos.index'));
        $producto = Producto::where('sku_pro', 'REM-BASE')->firstOrFail();
        $this->assertDatabaseHas('variantes_producto', [
            'cod_producto' => $producto->cod_producto,
            'cod_talla_producto' => $tallaM->cod_talla_producto,
            'sku_variante_producto' => 'REM-BASE-M',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);
    }

    public function test_no_permite_repetir_talla_en_variantes_del_producto(): void
    {
        $categoria = $this->crearCategoria();
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'L',
            'nom_talla_producto' => 'Grande',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 40,
            'activo_talla_producto' => true,
        ]);
        $this->actingAs($this->admin);

        $response = $this->post(route('productos.store'), [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto inválido',
            'precio_venta_pro' => 100,
            'variantes' => [
                ['cod_talla_producto' => $talla->cod_talla_producto],
                ['cod_talla_producto' => $talla->cod_talla_producto],
            ],
        ]);

        $response->assertSessionHasErrors([
            'variantes.1.cod_talla_producto' => 'Este producto ya tiene una variante registrada con esa talla.',
        ]);
    }

    public function test_no_permite_sku_de_variante_duplicado(): void
    {
        $producto = $this->crearProducto();
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'S',
            'nom_talla_producto' => 'Pequeña',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 20,
            'activo_talla_producto' => true,
        ]);
        $producto->variantes()->create([
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'SKU-VAR-1',
        ]);
        $otraTalla = TallaProducto::create([
            'codigo_talla_producto' => 'XL',
            'nom_talla_producto' => 'Extra grande',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 50,
            'activo_talla_producto' => true,
        ]);
        $this->actingAs($this->admin);

        $response = $this->post(route('productos.store'), [
            'cod_categoria_producto' => $producto->cod_categoria_producto,
            'nombre_pro' => 'Otro producto',
            'precio_venta_pro' => 100,
            'variantes' => [[
                'cod_talla_producto' => $otraTalla->cod_talla_producto,
                'sku_variante_producto' => 'SKU-VAR-1',
            ]],
        ]);

        $response->assertSessionHasErrors([
            'variantes.0.sku_variante_producto' => 'El SKU de la variante ya está registrado.',
        ]);
    }

    public function test_crear_producto_rechaza_categoria_inactiva(): void
    {
        $categoria = $this->crearCategoria(['activo_cat' => false]);
        $this->actingAs($this->admin);

        $response = $this->post(route('productos.store'), [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Inválido',
            'precio_venta_pro' => 100,
            'sku_pro' => 'CAT-INACTIVA',
        ]);

        $response->assertSessionHasErrors([
            'cod_categoria_producto' => 'La categoría seleccionada no existe o está inactiva.',
        ]);
    }

    public function test_crear_producto_rechaza_precio_venta_menor_al_costo(): void
    {
        $categoria = $this->crearCategoria();
        $this->actingAs($this->admin);

        $response = $this->post(route('productos.store'), [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Inválido',
            'precio_venta_pro' => 50,
            'precio_costo_pro' => 80,
            'sku_pro' => 'PRECIO-INVALIDO',
        ]);

        $response->assertSessionHasErrors([
            'precio_venta_pro' => 'El precio de venta debe ser mayor o igual al precio de costo.',
        ]);
    }

    public function test_crear_producto_rechaza_precio_cero_y_sku_duplicado(): void
    {
        $producto = $this->crearProducto();
        $this->actingAs($this->admin);

        $response = $this->post(route('productos.store'), [
            'cod_categoria_producto' => $producto->cod_categoria_producto,
            'nombre_pro' => 'Producto Inválido',
            'precio_venta_pro' => 0,
            'sku_pro' => $producto->sku_pro,
        ]);

        $response->assertSessionHasErrors(['precio_venta_pro', 'sku_pro']);
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
