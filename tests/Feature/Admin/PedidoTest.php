<?php

namespace Tests\Feature\Admin;

use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Models\Inventario;
use App\Models\Pedido;

class PedidoTest extends AdminTestCase
{
    public function test_admin_puede_crear_pedido_con_stock_suficiente(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $cliente = $this->crearCliente();

        $this->actingAs($this->admin);

        $this->post(route('pedidos.store'), [
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'detalles' => [
                [
                    'cod_producto' => $producto->cod_producto,
                    'cantidad_det' => 3,
                    'precio_unitario_det' => 100.00,
                ],
            ],
        ]);

        $this->assertDatabaseHas('pedidos', [
            'cod_cliente' => $cliente->cod_cliente,
            'estado_ped' => EstadoPedidoEnum::BORRADOR->value,
        ]);
        $this->assertDatabaseHas('detalles_pedido', [
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 3,
        ]);
    }

    public function test_crear_pedido_falla_si_stock_insuficiente(): void
    {
        [$producto] = $this->crearProductoConStock(2);
        $cliente = $this->crearCliente();

        $this->actingAs($this->admin);

        $response = $this->post(route('pedidos.store'), [
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'detalles' => [
                [
                    'cod_producto' => $producto->cod_producto,
                    'cantidad_det' => 5,
                    'precio_unitario_det' => 100.00,
                ],
            ],
        ]);

        $response->assertSessionHasErrors('detalles');
        $this->assertDatabaseCount('pedidos', 0);
    }

    public function test_crear_pedido_falla_si_producto_inactivo(): void
    {
        [$producto] = $this->crearProductoConStock(10, ['estado_pro' => 'inactivo']);
        $cliente = $this->crearCliente();

        $this->actingAs($this->admin);

        $response = $this->post(route('pedidos.store'), [
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'detalles' => [
                [
                    'cod_producto' => $producto->cod_producto,
                    'cantidad_det' => 1,
                    'precio_unitario_det' => 100.00,
                ],
            ],
        ]);

        $response->assertSessionHasErrors('detalles');
        $this->assertDatabaseCount('pedidos', 0);
    }

    public function test_confirmar_pedido_descuenta_stock(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $cliente = $this->crearCliente();

        $pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-000001',
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => EstadoPedidoEnum::BORRADOR,
            'subtotal_ped' => 300,
            'total_ped' => 300,
        ]);

        $pedido->detalles()->create([
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 3,
            'precio_unitario_det' => 100.00,
            'subtotal_det' => 300.00,
        ]);

        $this->actingAs($this->admin);

        $response = $this->post(route('pedidos.confirmar', $pedido));

        $response->assertRedirect();
        $pedido->refresh();
        $this->assertEquals(EstadoPedidoEnum::CONFIRMADO->value, $pedido->estado_ped->value);

        $inventario = Inventario::where('cod_producto', $producto->cod_producto)->first();
        $this->assertEquals(7, $inventario->stock_actual_inv);
    }

    public function test_confirmar_pedido_falla_si_stock_ya_no_alcanza(): void
    {
        [$producto] = $this->crearProductoConStock(2);
        $cliente = $this->crearCliente();

        $pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-000001',
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => EstadoPedidoEnum::BORRADOR,
            'subtotal_ped' => 500,
            'total_ped' => 500,
        ]);

        $pedido->detalles()->create([
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 5,
            'precio_unitario_det' => 100.00,
            'subtotal_det' => 500.00,
        ]);

        $this->actingAs($this->admin);

        $response = $this->post(route('pedidos.confirmar', $pedido));

        $pedido->refresh();
        $this->assertEquals(EstadoPedidoEnum::BORRADOR->value, $pedido->estado_ped->value);
    }

    public function test_cancelar_pedido_confirmado_restaura_stock(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $cliente = $this->crearCliente();

        $pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-000001',
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => EstadoPedidoEnum::CONFIRMADO,
            'subtotal_ped' => 300,
            'total_ped' => 300,
        ]);

        $pedido->detalles()->create([
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 3,
            'precio_unitario_det' => 100.00,
            'subtotal_det' => 300.00,
        ]);

        Inventario::where('cod_producto', $producto->cod_producto)->update(['stock_actual_inv' => 7]);

        $this->actingAs($this->admin);

        $response = $this->post(route('pedidos.cancelar', $pedido));

        $pedido->refresh();
        $this->assertEquals(EstadoPedidoEnum::CANCELADO->value, $pedido->estado_ped->value);

        $inventario = Inventario::where('cod_producto', $producto->cod_producto)->first();
        $this->assertEquals(10, $inventario->stock_actual_inv);
    }

    public function test_cancelar_pedido_borrador_no_modifica_stock(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $cliente = $this->crearCliente();

        $pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-000001',
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => EstadoPedidoEnum::BORRADOR,
            'subtotal_ped' => 100,
            'total_ped' => 100,
        ]);

        $pedido->detalles()->create([
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 1,
            'precio_unitario_det' => 100.00,
            'subtotal_det' => 100.00,
        ]);

        $this->actingAs($this->admin);

        $response = $this->post(route('pedidos.cancelar', $pedido));

        $pedido->refresh();
        $this->assertEquals(EstadoPedidoEnum::CANCELADO->value, $pedido->estado_ped->value);

        $inventario = Inventario::where('cod_producto', $producto->cod_producto)->first();
        $this->assertEquals(10, $inventario->stock_actual_inv);
    }

    public function test_pedido_confirmado_no_puede_editarse(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $cliente = $this->crearCliente();

        $pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-000001',
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => EstadoPedidoEnum::CONFIRMADO,
            'subtotal_ped' => 100,
            'total_ped' => 100,
        ]);

        $this->actingAs($this->admin);

        $response = $this->put(route('pedidos.update', $pedido), [
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $pedido->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $pedido->cod_tipo_flujo_comercial,
            'detalles' => [
                [
                    'cod_producto' => $producto->cod_producto,
                    'cantidad_det' => 2,
                    'precio_unitario_det' => 100.00,
                ],
            ],
        ]);

        $pedido->refresh();
        $this->assertEquals(100.00, (float) $pedido->total_ped);
    }

    public function test_listar_pedidos_requiere_auth(): void
    {
        $response = $this->get(route('pedidos.index'));

        $response->assertRedirect('/login');
    }

    public function test_listar_pedidos_muestra_datos(): void
    {
        $cliente = $this->crearCliente();

        Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-000001',
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => EstadoPedidoEnum::BORRADOR,
            'subtotal_ped' => 100,
            'total_ped' => 100,
        ]);

        $this->actingAs($this->admin);

        $response = $this->get(route('pedidos.index'));

        $response->assertStatus(200);
    }
}
