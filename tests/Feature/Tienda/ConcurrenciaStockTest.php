<?php

namespace Tests\Feature\Tienda;

use App\Domains\Tienda\Carrito\Enums\EstadoReservaStockEnum;
use App\Models\Inventario;
use App\Models\ReservaStockCarrito;
use App\Models\User;

class ConcurrenciaStockTest extends TiendaTestCase
{
    private Inventario $inventario;
    private \App\Models\Producto $producto;

    protected function setUp(): void
    {
        parent::setUp();

        $categoria = \App\Models\CategoriaProducto::create([
            'nombre_cat' => 'Test',
            'activo_cat' => true,
        ]);

        $this->producto = \App\Models\Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Concurrencia',
            'precio_venta_pro' => 50.00,
            'sku_pro' => 'CONC-001',
            'estado_pro' => 'activo',
        ]);

        $this->inventario = Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'stock_actual_inv' => 1,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);
    }

    public function test_conc01_dos_clientes_ultimo_stock(): void
    {
        $user1 = $this->crearUsuarioCliente(['email' => 'user1@test.com']);
        $user2 = $this->crearUsuarioCliente(['email' => 'user2@test.com']);

        $response1 = $this->actingAs($user1)->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 1,
        ]);

        $response2 = $this->actingAs($user2)->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 1,
        ]);

        $reservasActivas = ReservaStockCarrito::where('cod_producto', $this->producto->cod_producto)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->count();

        $this->assertLessThanOrEqual(1, $reservasActivas);
    }

    public function test_conc02_admin_acepta_pago_dos_veces(): void
    {
        $admin = User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $cliente = $this->crearUsuarioCliente();

        $canal = \App\Models\CanalVenta::first();
        $flujo = \App\Models\TipoFlujoComercial::first();

        $clienteModel = \App\Models\Cliente::create([
            'nombre_cli' => 'Cliente Conc',
            'correo_cli' => $cliente->email,
            'estado_cli' => 'activo',
            'cod_canal_venta' => $canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
        ]);

        $cuentaCliente = \App\Models\CuentaCliente::create([
            'user_id' => $cliente->id,
            'cod_cliente' => $clienteModel->cod_cliente,
            'estado_cue' => 'activa',
            'fecha_activacion_cue' => now(),
        ]);

        $pedido = \App\Models\Pedido::create([
            'cod_cliente' => $clienteModel->cod_cliente,
            'cod_canal_venta' => $canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-' . strtoupper(uniqid()),
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => 'borrador',
            'moneda_ped' => 'BOB',
            'subtotal_ped' => 50.00,
            'total_ped' => 50.00,
        ]);

        $carrito = \App\Models\Carrito::create([
            'user_id' => $cliente->id,
            'cod_cliente' => $clienteModel->cod_cliente,
            'estado_car' => 'activo',
            'moneda_car' => 'BOB',
            'subtotal_car' => 0,
            'total_car' => 0,
        ]);

        \App\Models\DetalleCarrito::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_producto' => $this->producto->cod_producto,
            'cantidad_dca' => 1,
            'precio_unitario_dca' => 50.00,
            'subtotal_dca' => 50.00,
            'nombre_producto_dca' => 'Producto Conc',
            'sku_producto_dca' => 'CONC-001',
        ]);

        $checkoutSesion = \App\Models\CheckoutSesion::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'token_che' => 'test-conc-token-' . uniqid(),
            'estado_che' => 'pago_registrado',
            'email_contacto_che' => $cliente->email,
            'telefono_contacto_che' => '12345678',
        ]);

        \App\Models\PedidoTienda::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_checkout_sesion' => $checkoutSesion->cod_checkout_sesion,
            'user_id' => $cliente->id,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'estado_pte' => 'pendiente_validacion_pago',
        ]);

        $pago = \App\Models\Pago::create([
            'cod_pedido' => $pedido->cod_pedido,
            'estado_pago_pag' => 'pendiente',
            'monto_pag' => 50.00,
            'metodo_pago_pag' => 'transferencia',
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        \App\Models\PagoTienda::create([
            'cod_pago' => $pago->cod_pago,
            'cod_checkout_sesion' => $checkoutSesion->cod_checkout_sesion,
            'user_id' => $cliente->id,
            'banco_origen_pwe' => 'BNB',
        ]);

        \App\Models\DetallePedido::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_producto' => $this->producto->cod_producto,
            'cantidad_det' => 1,
            'precio_unitario_det' => 50.00,
            'subtotal_det' => 50.00,
        ]);

        $stockAntes = $this->inventario->stock_actual_inv;

        $this->actingAs($admin)->postJson("/admin/tienda/pagos/{$pago->cod_pago}/aceptar");

        $response2 = $this->actingAs($admin)->postJson("/admin/tienda/pagos/{$pago->cod_pago}/aceptar");

        $response2->assertStatus(422);

        $this->inventario->refresh();
        $this->assertEquals($stockAntes - 1, $this->inventario->stock_actual_inv);
    }

    public function test_conc03_reserva_vence_mientras_checkout(): void
    {
        $user = $this->crearUsuarioCliente();

        $this->actingAs($user)->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 1,
        ]);

        $reserva = ReservaStockCarrito::where('cod_producto', $this->producto->cod_producto)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->first();

        $reserva->update([
            'expira_en_res' => now()->subMinute(),
        ]);

        $carrito = $reserva->carrito;

        $response = $this->actingAs($user)->postJson('/tienda/checkout', [
            'cod_carrito' => $carrito->cod_carrito,
        ]);

        $response->assertStatus(422);
    }
}
