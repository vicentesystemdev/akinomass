<?php

namespace Tests\Feature\Admin;

use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Domains\Inventario\Services\InventarioService;
use App\Models\Inventario;
use App\Models\MovimientoInventario;

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
}
