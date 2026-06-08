<?php

namespace Tests\Feature\Tienda;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
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
use App\Models\Pago;
use App\Models\PagoTienda;
use App\Models\Pedido;
use App\Models\PedidoTienda;
use App\Models\Producto;
use App\Models\TipoFlujoComercial;
use App\Models\User;

class AdminPagoTiendaTest extends TiendaTestCase
{
    private User $admin;
    private User $cliente;
    private PedidoTienda $pedidoTienda;
    private Pago $pago;
    private PagoTienda $pagoTienda;

    protected function setUp(): void
    {
        parent::setUp();

        $canal = CanalVenta::first();
        $flujo = TipoFlujoComercial::first();

        $this->admin = User::factory()->create(['email_verified_at' => now()]);
        $this->admin->assignRole('Administrador');

        $this->cliente = $this->crearUsuarioCliente();

        $clienteModel = Cliente::create([
            'nombre_cli' => 'Cliente Pago',
            'correo_cli' => $this->cliente->email,
            'estado_cli' => 'activo',
            'cod_canal_venta' => $canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
        ]);

        $cuentaCliente = CuentaCliente::create([
            'user_id' => $this->cliente->id,
            'cod_cliente' => $clienteModel->cod_cliente,
            'estado_cue' => 'activa',
            'fecha_activacion_cue' => now(),
        ]);

        $pedido = Pedido::create([
            'cod_cliente' => $clienteModel->cod_cliente,
            'cod_canal_venta' => $canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
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
            'nombre_pro' => 'Producto Pago',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'PAG-001',
            'estado_pro' => 'activo',
        ]);

        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'stock_actual_inv' => 10,
            'activo_inv' => true,
        ]);

        DetalleCarrito::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_producto' => $producto->cod_producto,
            'cantidad_dca' => 2,
            'precio_unitario_dca' => 100.00,
            'subtotal_dca' => 200.00,
            'nombre_producto_dca' => 'Producto Pago',
            'sku_producto_dca' => 'PAG-001',
        ]);

        $checkoutSesion = CheckoutSesion::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'token_che' => 'test-pago-token-' . uniqid(),
            'estado_che' => EstadoCheckoutSesionEnum::PAGO_REGISTRADO,
            'email_contacto_che' => $this->cliente->email,
            'telefono_contacto_che' => '12345678',
        ]);

        $this->pedidoTienda = PedidoTienda::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_checkout_sesion' => $checkoutSesion->cod_checkout_sesion,
            'user_id' => $this->cliente->id,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'estado_pte' => EstadoPedidoTiendaEnum::PENDIENTE_VALIDACION_PAGO,
        ]);

        $this->pago = Pago::create([
            'cod_pedido' => $pedido->cod_pedido,
            'estado_pago_pag' => 'pendiente',
            'monto_pag' => 200.00,
            'metodo_pago_pag' => 'transferencia',
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $this->pagoTienda = PagoTienda::create([
            'cod_pago' => $this->pago->cod_pago,
            'cod_checkout_sesion' => $checkoutSesion->cod_checkout_sesion,
            'user_id' => $this->cliente->id,
            'banco_origen_pwe' => 'BNB',
        ]);

        \App\Models\DetallePedido::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 2,
            'precio_unitario_det' => 100.00,
            'subtotal_det' => 200.00,
        ]);
    }

    public function test_qa15_observar_pago_cliente_puede_resubir(): void
    {
        $response = $this->actingAs($this->admin)->postJson(
            "/admin/tienda/pagos/{$this->pago->cod_pago}/observar",
            ['motivo' => 'Imagen borrosa']
        );

        $response->assertStatus(200);

        $this->pago->refresh();
        $this->assertEquals(EstadoPagoEnum::OBSERVADO, $this->pago->estado_pago_pag);
    }

    public function test_qa16_rechazar_pago_cliente_puede_resubir(): void
    {
        $response = $this->actingAs($this->admin)->postJson(
            "/admin/tienda/pagos/{$this->pago->cod_pago}/rechazar",
            ['motivo' => 'No corresponde']
        );

        $response->assertStatus(200);

        $this->pago->refresh();
        $this->assertEquals(EstadoPagoEnum::RECHAZADO, $this->pago->estado_pago_pag);
    }

    public function test_qa19_aceptar_pago_dos_veces_no_duplica(): void
    {
        $this->actingAs($this->admin)->postJson(
            "/admin/tienda/pagos/{$this->pago->cod_pago}/aceptar"
        );

        $response = $this->actingAs($this->admin)->postJson(
            "/admin/tienda/pagos/{$this->pago->cod_pago}/aceptar"
        );

        $response->assertStatus(422);
    }

    public function test_usuario_sin_permiso_no_puede_aceptar_pago(): void
    {
        $cliente2 = $this->crearUsuarioCliente();

        $response = $this->actingAs($cliente2)->postJson(
            "/admin/tienda/pagos/{$this->pago->cod_pago}/aceptar"
        );

        $response->assertStatus(302);
    }

    public function test_ver_pago_admin_con_comprobantes(): void
    {
        $response = $this->actingAs($this->admin)->getJson(
            "/admin/tienda/pagos/{$this->pago->cod_pago}"
        );

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'pagoTienda',
            'pago',
            'comprobantes',
        ]);
    }
}
