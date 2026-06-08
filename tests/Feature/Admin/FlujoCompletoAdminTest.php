<?php

namespace Tests\Feature\Admin;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Models\Inventario;
use App\Models\Pago;
use App\Models\Pedido;

class FlujoCompletoAdminTest extends AdminTestCase
{
    public function test_flujo_completo_crear_pedido_confirmar_pago_stock(): void
    {
        [$producto1, $inv1] = $this->crearProductoConStock(10, ['nombre_pro' => 'Producto A', 'sku_pro' => 'A-001']);
        [$producto2, $inv2] = $this->crearProductoConStock(20, ['nombre_pro' => 'Producto B', 'sku_pro' => 'B-001']);
        $cliente = $this->crearCliente();

        $this->actingAs($this->admin);

        // PASO 1: Crear pedido (valida stock)
        $this->post(route('pedidos.store'), [
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'detalles' => [
                ['cod_producto' => $producto1->cod_producto, 'cantidad_det' => 4, 'precio_unitario_det' => 100],
                ['cod_producto' => $producto2->cod_producto, 'cantidad_det' => 5, 'precio_unitario_det' => 200],
            ],
        ]);

        $pedido = Pedido::latest('cod_pedido')->first();
        $this->assertEquals(EstadoPedidoEnum::BORRADOR->value, $pedido->estado_ped->value);
        $this->assertEquals(1400.00, (float) $pedido->total_ped);

        // Stock NO se descuenta al crear (borrador)
        $this->assertEquals(10, Inventario::where('cod_producto', $producto1->cod_producto)->first()->stock_actual_inv);
        $this->assertEquals(20, Inventario::where('cod_producto', $producto2->cod_producto)->first()->stock_actual_inv);

        // PASO 2: Registrar pago
        $this->post(route('pagos.store'), [
            'cod_pedido' => $pedido->cod_pedido,
            'metodo_pago_pag' => 'transferencia',
            'monto_pag' => $pedido->total_ped,
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $pago = Pago::where('cod_pedido', $pedido->cod_pedido)->first();
        $this->assertNotNull($pago);
        $this->assertEquals(EstadoPagoEnum::PENDIENTE->value, $pago->estado_pago_pag->value);

        // PASO 3: Confirmar pago → auto-confirma pedido → descuenta stock
        $this->post(route('pagos.confirmar', $pago));

        $pago->refresh();
        $this->assertEquals(EstadoPagoEnum::PAGADO->value, $pago->estado_pago_pag->value);

        $pedido->refresh();
        $this->assertEquals(EstadoPedidoEnum::CONFIRMADO->value, $pedido->estado_ped->value);

        // Stock descontado
        $this->assertEquals(6, Inventario::where('cod_producto', $producto1->cod_producto)->first()->stock_actual_inv);
        $this->assertEquals(15, Inventario::where('cod_producto', $producto2->cod_producto)->first()->stock_actual_inv);

        // PASO 4: Cancelar pedido → restaura stock
        $this->post(route('pedidos.cancelar', $pedido));

        $pedido->refresh();
        $this->assertEquals(EstadoPedidoEnum::CANCELADO->value, $pedido->estado_ped->value);

        // Stock restaurado
        $this->assertEquals(10, Inventario::where('cod_producto', $producto1->cod_producto)->first()->stock_actual_inv);
        $this->assertEquals(20, Inventario::where('cod_producto', $producto2->cod_producto)->first()->stock_actual_inv);
    }

    public function test_pedido_con_stock_insuficiente_se_rechaza(): void
    {
        [$producto] = $this->crearProductoConStock(3, ['nombre_pro' => 'Poco Stock', 'sku_pro' => 'LOW-001']);
        $cliente = $this->crearCliente();

        $this->actingAs($this->admin);

        $response = $this->post(route('pedidos.store'), [
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'detalles' => [
                ['cod_producto' => $producto->cod_producto, 'cantidad_det' => 10, 'precio_unitario_det' => 100],
            ],
        ]);

        $response->assertSessionHasErrors('detalles');
        $this->assertDatabaseCount('pedidos', 0);

        // Stock sin cambios
        $this->assertEquals(3, Inventario::where('cod_producto', $producto->cod_producto)->first()->stock_actual_inv);
    }

    public function test_confirmar_pago_pedido_ya_confirmado_no_duplica(): void
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
            'precio_unitario_det' => 100,
            'subtotal_det' => 300,
        ]);

        $pago = Pago::create([
            'cod_pedido' => $pedido->cod_pedido,
            'metodo_pago_pag' => 'transferencia',
            'estado_pago_pag' => EstadoPagoEnum::PENDIENTE,
            'monto_pag' => 300,
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $this->actingAs($this->admin);

        $this->post(route('pagos.confirmar', $pago));

        $pedido->refresh();
        $this->assertEquals(EstadoPedidoEnum::CONFIRMADO->value, $pedido->estado_ped->value);

        // Stock no se descuenta doble
        $this->assertEquals(10, Inventario::where('cod_producto', $producto->cod_producto)->first()->stock_actual_inv);
    }
}
