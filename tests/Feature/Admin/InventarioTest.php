<?php

namespace Tests\Feature\Admin;

use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Domains\Inventario\Services\InventarioService;
use App\Models\Carrito;
use App\Models\Inventario;
use App\Models\MovimientoInventario;
use App\Models\ReservaStockCarrito;
use App\Models\TallaProducto;
use App\Models\VarianteProducto;
use Inertia\Testing\AssertableInertia as Assert;

class InventarioTest extends AdminTestCase
{
    public function test_registrar_entrada_aumenta_stock(): void
    {
        [$producto] = $this->crearProductoConStock(5);

        $this->actingAs($this->admin);

        $response = $this->post(route('inventario.entrada'), [
            'cod_producto' => $producto->cod_producto,
            'cantidad_mov' => 10,
            'motivo_mov' => 'compra',
            'observacion_mov' => 'Compra a proveedor',
        ]);

        $response->assertRedirect();

        $inventario = Inventario::where('cod_producto', $producto->cod_producto)->first();
        $this->assertEquals(15, $inventario->stock_actual_inv);
    }

    public function test_registrar_salida_descuenta_stock(): void
    {
        [$producto] = $this->crearProductoConStock(10);

        $this->actingAs($this->admin);

        $response = $this->post(route('inventario.salida'), [
            'cod_producto' => $producto->cod_producto,
            'cantidad_mov' => 3,
            'motivo_mov' => 'venta_directa',
            'observacion_mov' => 'Venta en tienda',
        ]);

        $response->assertRedirect();

        $inventario = Inventario::where('cod_producto', $producto->cod_producto)->first();
        $this->assertEquals(7, $inventario->stock_actual_inv);
    }

    public function test_salida_falla_si_stock_insuficiente(): void
    {
        [$producto] = $this->crearProductoConStock(2);

        $this->actingAs($this->admin);

        try {
            $this->post(route('inventario.salida'), [
                'cod_producto' => $producto->cod_producto,
                'cantidad_mov' => 5,
                'motivo_mov' => 'venta',
            ]);
        } catch (\RuntimeException $e) {
            $this->assertStringContainsString('stock negativo', $e->getMessage());
        }

        $inventario = Inventario::where('cod_producto', $producto->cod_producto)->first();
        $this->assertEquals(2, $inventario->stock_actual_inv);
    }

    public function test_ajuste_cambia_stock_a_valor_especifico(): void
    {
        [$producto] = $this->crearProductoConStock(10);

        $this->actingAs($this->admin);

        $response = $this->post(route('inventario.ajuste'), [
            'cod_producto' => $producto->cod_producto,
            'stock_nuevo_mov' => 25,
            'motivo_mov' => 'inventario_fisico',
            'observacion_mov' => 'Ajuste por conteo físico',
        ]);

        $response->assertRedirect();

        $inventario = Inventario::where('cod_producto', $producto->cod_producto)->first();
        $this->assertEquals(25, $inventario->stock_actual_inv);
    }

    public function test_ajuste_rechaza_stock_negativo_con_mensaje_en_espanol(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $this->actingAs($this->admin);

        $response = $this->post(route('inventario.ajuste'), [
            'cod_producto' => $producto->cod_producto,
            'stock_nuevo_mov' => -1,
            'motivo_mov' => 'ajuste',
        ]);

        $response->assertSessionHasErrors([
            'stock_nuevo_mov' => 'El nuevo stock no puede ser negativo.',
        ]);
    }

    public function test_movimiento_crea_registro_en_movimientos_inventario(): void
    {
        [$producto] = $this->crearProductoConStock(10);

        $this->actingAs($this->admin);

        $this->post(route('inventario.entrada'), [
            'cod_producto' => $producto->cod_producto,
            'cantidad_mov' => 5,
            'motivo_mov' => 'compra',
        ]);

        $inventario = Inventario::where('cod_producto', $producto->cod_producto)->first();

        $this->assertDatabaseHas('movimientos_inventario', [
            'cod_inventario' => $inventario->cod_inventario,
            'cod_producto' => $producto->cod_producto,
            'tipo_movimiento_mov' => TipoMovimientoInventarioEnum::ENTRADA->value,
            'cantidad_mov' => 5,
            'stock_anterior_mov' => 10,
            'stock_nuevo_mov' => 15,
        ]);
    }

    public function test_batch_movimientos_funciona_correctamente(): void
    {
        [$producto1] = $this->crearProductoConStock(10);
        $producto2 = $this->crearProducto(attributes: ['nombre_pro' => 'Producto 2', 'sku_pro' => 'TEST-002']);
        $this->crearInventario($producto2, 20);

        $service = app(InventarioService::class);

        $resultados = $service->registrarMovimientosBatch([
            [
                'cod_producto' => $producto1->cod_producto,
                'tipo' => TipoMovimientoInventarioEnum::SALIDA,
                'cantidad' => 3,
                'motivo' => 'test',
            ],
            [
                'cod_producto' => $producto2->cod_producto,
                'tipo' => TipoMovimientoInventarioEnum::ENTRADA,
                'cantidad' => 5,
                'motivo' => 'test',
            ],
        ]);

        $this->assertEquals(7, Inventario::where('cod_producto', $producto1->cod_producto)->first()->stock_actual_inv);
        $this->assertEquals(25, Inventario::where('cod_producto', $producto2->cod_producto)->first()->stock_actual_inv);
    }

    public function test_listar_inventario_requiere_auth(): void
    {
        $response = $this->get(route('inventario.index'));

        $response->assertRedirect('/login');
    }

    public function test_listar_inventario_muestra_datos(): void
    {
        [$producto] = $this->crearProductoConStock(10);

        $this->actingAs($this->admin);

        $response = $this->get(route('inventario.index'));

        $response->assertStatus(200);
    }

    public function test_inventario_principal_agrupa_stock_y_reservas_por_categoria(): void
    {
        $categoria = $this->crearCategoria(['nombre_cat' => 'BLUSAS']);
        $producto = $this->crearProducto($categoria);
        $this->crearInventario($producto, 10);
        $carrito = Carrito::create([
            'session_id_car' => 'inventario-test',
            'estado_car' => 'activo',
        ]);
        ReservaStockCarrito::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_producto' => $producto->cod_producto,
            'session_id_res' => 'inventario-test',
            'cantidad_res' => 3,
            'estado_res' => 'activa',
            'expira_en_res' => now()->addHour(),
        ]);

        $response = $this->actingAs($this->admin)->get(route('inventario.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Inventario/Index')
            ->where('categorias.data.0.nombre_cat', 'BLUSAS')
            ->where('categorias.data.0.stock_total', 10)
            ->where('categorias.data.0.stock_reservado', 3)
            ->where('categorias.data.0.stock_disponible', 7)
        );
    }

    public function test_inventario_muestra_detalle_de_categoria_en_ruta_existente(): void
    {
        $categoria = $this->crearCategoria(['nombre_cat' => 'PANTALONES']);
        [$producto] = $this->crearProductoConStock(8, [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
        ]);

        $response = $this->actingAs($this->admin)->get(route('inventario.index', [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
        ]));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('detalleCategoria.categoria.cod_categoria_producto', $categoria->cod_categoria_producto)
            ->where('detalleCategoria.productos.0.cod_producto', $producto->cod_producto)
            ->where('detalleCategoria.productos.0.stock_actual', 8)
        );
    }

    public function test_movimientos_pueden_filtrarse_por_categoria(): void
    {
        $categoriaIncluida = $this->crearCategoria(['nombre_cat' => 'ROPA']);
        $categoriaExcluida = $this->crearCategoria(['nombre_cat' => 'CALZADO']);
        $productoIncluido = $this->crearProducto($categoriaIncluida, ['sku_pro' => 'ROP-001']);
        $productoExcluido = $this->crearProducto($categoriaExcluida, ['sku_pro' => 'CAL-001']);
        $inventarioIncluido = $this->crearInventario($productoIncluido, 5);
        $inventarioExcluido = $this->crearInventario($productoExcluido, 5);

        foreach ([[$productoIncluido, $inventarioIncluido], [$productoExcluido, $inventarioExcluido]] as [$producto, $inventario]) {
            MovimientoInventario::create([
                'cod_inventario' => $inventario->cod_inventario,
                'cod_producto' => $producto->cod_producto,
                'tipo_movimiento_mov' => TipoMovimientoInventarioEnum::ENTRADA,
                'cantidad_mov' => 5,
                'stock_anterior_mov' => 0,
                'stock_nuevo_mov' => 5,
                'motivo_mov' => 'Carga inicial',
            ]);
        }

        $response = $this->actingAs($this->admin)->get(route('inventario.movimientos', [
            'cod_categoria_producto' => $categoriaIncluida->cod_categoria_producto,
        ]));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('movimientos.data', 1)
            ->where('movimientos.data.0.cod_producto', $productoIncluido->cod_producto)
            ->where('filtros.cod_categoria_producto', $categoriaIncluida->cod_categoria_producto)
        );
    }

    public function test_producto_puede_tener_inventario_base_e_inventario_por_variante(): void
    {
        [$producto, $inventarioBase] = $this->crearProductoConStock(10);
        $variante = $this->crearVariante($producto);

        $inventarioVariante = app(InventarioService::class)->crearOActualizarInventario([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
        ]);

        $this->assertNotEquals($inventarioBase->cod_inventario, $inventarioVariante->cod_inventario);
        $this->assertEquals(0, $inventarioVariante->stock_actual_inv);
        $this->assertEquals(2, Inventario::where('cod_producto', $producto->cod_producto)->count());
    }

    public function test_no_duplica_inventario_de_la_misma_variante(): void
    {
        $producto = $this->crearProducto();
        $variante = $this->crearVariante($producto);
        $service = app(InventarioService::class);

        $primero = $service->crearOActualizarInventario([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
        ]);
        $segundo = $service->crearOActualizarInventario([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
        ]);

        $this->assertEquals($primero->cod_inventario, $segundo->cod_inventario);
        $this->assertEquals(1, Inventario::where('cod_variante_producto', $variante->cod_variante_producto)->count());
    }

    public function test_ajuste_por_variante_crea_y_actualiza_inventario_correcto(): void
    {
        [$producto, $inventarioBase] = $this->crearProductoConStock(10);
        $variante = $this->crearVariante($producto);

        $response = $this->actingAs($this->admin)->post(route('inventario.ajuste'), [
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'stock_nuevo_mov' => 7,
            'motivo_mov' => 'Conteo por talla',
        ]);

        $response->assertRedirect();
        $inventarioVariante = Inventario::where('cod_variante_producto', $variante->cod_variante_producto)->firstOrFail();

        $this->assertEquals(7, $inventarioVariante->stock_actual_inv);
        $this->assertEquals(10, $inventarioBase->fresh()->stock_actual_inv);
        $this->assertDatabaseHas('movimientos_inventario', [
            'cod_inventario' => $inventarioVariante->cod_inventario,
            'cod_producto' => $producto->cod_producto,
            'stock_nuevo_mov' => 7,
        ]);
    }

    private function crearVariante($producto): VarianteProducto
    {
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'TEST-M',
            'nom_talla_producto' => 'Test M',
            'tipo_talla_producto' => 'general',
            'orden_talla_producto' => 1,
            'activo_talla_producto' => true,
        ]);

        return VarianteProducto::create([
            'cod_producto' => $producto->cod_producto,
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'VAR-'.$producto->cod_producto,
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);
    }
}
