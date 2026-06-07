<?php

namespace Tests\Feature\Admin;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Models\Inventario;
use App\Models\Pago;
use App\Models\Pedido;

class PagoTest extends AdminTestCase
{
    private Pedido $pedido;

    protected function setUp(): void
    {
        parent::setUp();

        $cliente = $this->crearCliente();
        [$producto] = $this->crearProductoConStock(10);

        $this->pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $this->crearCanalVenta()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->crearTipoFlujo()->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-000001',
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => EstadoPedidoEnum::BORRADOR,
            'subtotal_ped' => 300,
            'total_ped' => 300,
        ]);

        $this->pedido->detalles()->create([
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 3,
            'precio_unitario_det' => 100.00,
            'subtotal_det' => 300.00,
        ]);
    }

    public function test_admin_puede_crear_pago(): void
    {
        $this->actingAs($this->admin);

        $response = $this->post(route('pagos.store'), [
            'cod_pedido' => $this->pedido->cod_pedido,
            'metodo_pago_pag' => 'transferencia',
            'monto_pag' => 300,
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $response->assertRedirect(route('pagos.index'));
        $this->assertDatabaseHas('pagos', [
            'cod_pedido' => $this->pedido->cod_pedido,
            'estado_pago_pag' => EstadoPagoEnum::PENDIENTE->value,
        ]);
    }

    public function test_confirmar_pago_cambia_estado_a_pagado(): void
    {
        $pago = Pago::create([
            'cod_pedido' => $this->pedido->cod_pedido,
            'metodo_pago_pag' => 'transferencia',
            'estado_pago_pag' => EstadoPagoEnum::PENDIENTE,
            'monto_pag' => 300,
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $this->actingAs($this->admin);

        $response = $this->post(route('pagos.confirmar', $pago));

        $pago->refresh();
        $this->assertEquals(EstadoPagoEnum::PAGADO->value, $pago->estado_pago_pag->value);
    }

    public function test_confirmar_pago_auto_confirma_pedido_admin(): void
    {
        $pago = Pago::create([
            'cod_pedido' => $this->pedido->cod_pedido,
            'metodo_pago_pag' => 'transferencia',
            'estado_pago_pag' => EstadoPagoEnum::PENDIENTE,
            'monto_pag' => 300,
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $this->actingAs($this->admin);

        $this->post(route('pagos.confirmar', $pago));

        $this->pedido->refresh();
        $this->assertEquals(EstadoPedidoEnum::CONFIRMADO->value, $this->pedido->estado_ped->value);
    }

    public function test_confirmar_pago_auto_descuenta_stock_pedido_admin(): void
    {
        $pago = Pago::create([
            'cod_pedido' => $this->pedido->cod_pedido,
            'metodo_pago_pag' => 'transferencia',
            'estado_pago_pag' => EstadoPagoEnum::PENDIENTE,
            'monto_pag' => 300,
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $codProducto = $this->pedido->detalles->first()->cod_producto;

        $this->actingAs($this->admin);

        $this->post(route('pagos.confirmar', $pago));

        $inventario = Inventario::where('cod_producto', $codProducto)->first();
        $this->assertEquals(7, $inventario->stock_actual_inv);
    }

    public function test_confirmar_pago_ya_pagado_no_cambia_estado(): void
    {
        $pago = Pago::create([
            'cod_pedido' => $this->pedido->cod_pedido,
            'metodo_pago_pag' => 'transferencia',
            'estado_pago_pag' => EstadoPagoEnum::PAGADO,
            'monto_pag' => 300,
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $this->actingAs($this->admin);

        try {
            $this->post(route('pagos.confirmar', $pago));
        } catch (\RuntimeException $e) {
            // Expected: PagoService throws when already pagado
        }

        $pago->refresh();
        $this->assertEquals(EstadoPagoEnum::PAGADO->value, $pago->estado_pago_pag->value);
    }

    public function test_rechazar_pago(): void
    {
        $pago = Pago::create([
            'cod_pedido' => $this->pedido->cod_pedido,
            'metodo_pago_pag' => 'transferencia',
            'estado_pago_pag' => EstadoPagoEnum::PENDIENTE,
            'monto_pag' => 300,
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $this->actingAs($this->admin);

        $response = $this->post(route('pagos.rechazar', $pago));

        $pago->refresh();
        $this->assertEquals(EstadoPagoEnum::RECHAZADO->value, $pago->estado_pago_pag->value);
    }

    public function test_listar_pagos_requiere_auth(): void
    {
        $response = $this->get(route('pagos.index'));

        $response->assertRedirect('/login');
    }
}
