<?php

namespace Tests\Feature\Tienda;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Models\CanalVenta;
use App\Models\Carrito;
use App\Models\CategoriaProducto;
use App\Models\CheckoutSesion;
use App\Models\Cliente;
use App\Models\CuentaCliente;
use App\Models\DetalleCarrito;
use App\Models\Inventario;
use App\Models\Pedido;
use App\Models\PedidoTienda;
use App\Models\Producto;
use App\Models\ReservaStockCarrito;
use App\Models\TipoFlujoComercial;
use App\Models\User;

class AdminPedidoTiendaTest extends TiendaTestCase
{
    private User $admin;
    private User $cliente;
    private PedidoTienda $pedidoTienda;
    private CanalVenta $canal;
    private TipoFlujoComercial $flujo;

    protected function setUp(): void
    {
        parent::setUp();

        $this->canal = CanalVenta::first();
        $this->flujo = TipoFlujoComercial::first();

        $this->admin = User::factory()->create(['email_verified_at' => now()]);
        $this->admin->assignRole('Administrador');

        $this->cliente = $this->crearUsuarioCliente();

        $clienteModel = Cliente::create([
            'nombre_cli' => 'Cliente Pedido',
            'correo_cli' => $this->cliente->email,
            'estado_cli' => 'activo',
            'cod_canal_venta' => $this->canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->flujo->cod_tipo_flujo_comercial,
        ]);

        $cuentaCliente = CuentaCliente::create([
            'user_id' => $this->cliente->id,
            'cod_cliente' => $clienteModel->cod_cliente,
            'estado_cue' => 'activa',
            'fecha_activacion_cue' => now(),
        ]);

        $pedido = Pedido::create([
            'cod_cliente' => $clienteModel->cod_cliente,
            'cod_canal_venta' => $this->canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->flujo->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-' . strtoupper(uniqid()),
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => 'borrador',
            'moneda_ped' => 'BOB',
            'subtotal_ped' => 200.00,
            'total_ped' => 200.00,
        ]);

        $carrito = Carrito::create([
            'user_id' => $this->cliente->id,
            'cod_cliente' => $clienteModel->cod_cliente,
            'estado_car' => EstadoCarritoEnum::ACTIVO,
            'moneda_car' => 'BOB',
            'subtotal_car' => 0,
            'total_car' => 0,
        ]);

        $categoria = CategoriaProducto::create(['nombre_cat' => 'Test', 'activo_cat' => true]);

        $producto = Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Admin',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'ADM-001',
            'estado_pro' => 'activo',
        ]);

        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'stock_actual_inv' => 10,
            'activo_inv' => true,
        ]);

        $detalle = DetalleCarrito::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_producto' => $producto->cod_producto,
            'cantidad_dca' => 2,
            'precio_unitario_dca' => 100.00,
            'subtotal_dca' => 200.00,
            'nombre_producto_dca' => 'Producto Admin',
            'sku_producto_dca' => 'ADM-001',
        ]);

        ReservaStockCarrito::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_detalle_carrito' => $detalle->cod_detalle_carrito,
            'cod_producto' => $producto->cod_producto,
            'user_id' => $this->cliente->id,
            'cantidad_res' => 2,
            'estado_res' => 'activa',
            'expira_en_res' => now()->addMinutes(20),
        ]);

        $checkoutSesion = CheckoutSesion::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'token_che' => 'test-token-' . uniqid(),
            'estado_che' => EstadoCheckoutSesionEnum::PEDIDO_GENERADO,
            'email_contacto_che' => $this->cliente->email,
            'telefono_contacto_che' => '12345678',
        ]);

        $this->pedidoTienda = PedidoTienda::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_checkout_sesion' => $checkoutSesion->cod_checkout_sesion,
            'user_id' => $this->cliente->id,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'estado_pte' => EstadoPedidoTiendaEnum::PENDIENTE_REVISION,
        ]);

        \App\Models\DetallePedido::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 2,
            'precio_unitario_det' => 100.00,
            'subtotal_det' => 200.00,
        ]);
    }

    public function test_qa13_aceptar_pedido_no_descuenta_stock(): void
    {
        $inventario = Inventario::where('cod_producto', $this->pedidoTienda->pedido->detalles->first()->cod_producto)->first();
        $stockAntes = $inventario->stock_actual_inv;

        $response = $this->actingAs($this->admin)->postJson(
            "/admin/tienda/pedidos/{$this->pedidoTienda->cod_pedido_tienda}/aceptar"
        );

        $response->assertStatus(200);

        $inventario->refresh();
        $this->assertEquals($stockAntes, $inventario->stock_actual_inv);
    }

    public function test_qa14_rechazar_pedido_libera_reservas(): void
    {
        $response = $this->actingAs($this->admin)->postJson(
            "/admin/tienda/pedidos/{$this->pedidoTienda->cod_pedido_tienda}/rechazar",
            ['motivo' => 'No disponible']
        );

        $response->assertStatus(200);

        $reserva = ReservaStockCarrito::where('cod_producto', $this->pedidoTienda->pedido->detalles->first()->cod_producto)
            ->where('estado_res', 'liberada')
            ->first();

        $this->assertNotNull($reserva);
    }

    public function test_usuario_sin_permiso_no_puede_aceptar_pedido(): void
    {
        $cliente2 = $this->crearUsuarioCliente();

        $response = $this->actingAs($cliente2)->postJson(
            "/admin/tienda/pedidos/{$this->pedidoTienda->cod_pedido_tienda}/aceptar"
        );

        $response->assertStatus(302);
    }

    public function test_ver_pedido_admin(): void
    {
        $response = $this->actingAs($this->admin)->getJson(
            "/admin/tienda/pedidos/{$this->pedidoTienda->cod_pedido_tienda}"
        );

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'pedidoTienda',
            'pedido',
            'acciones_disponibles',
        ]);
    }

    public function test_acciones_disponibles_para_pendiente_revision(): void
    {
        $response = $this->actingAs($this->admin)->getJson(
            "/admin/tienda/pedidos/{$this->pedidoTienda->cod_pedido_tienda}"
        );

        $acciones = $response->json('acciones_disponibles');
        $this->assertTrue($acciones['aceptar_pedido']);
        $this->assertTrue($acciones['rechazar_pedido']);
        $this->assertFalse($acciones['aceptar_pago']);
    }
}
