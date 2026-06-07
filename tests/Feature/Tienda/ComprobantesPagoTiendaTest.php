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
use App\Models\ComprobantePagoTienda;
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

class ComprobantesPagoTiendaTest extends TiendaTestCase
{
    private User $admin;
    private User $cliente;
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
            'nombre_cli' => 'Cliente Comprobante',
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
            'nombre_pro' => 'Producto Comprobante',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'COMP-001',
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
            'nombre_producto_dca' => 'Producto Comprobante',
            'sku_producto_dca' => 'COMP-001',
        ]);

        $checkoutSesion = CheckoutSesion::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'token_che' => 'test-comp-token-' . uniqid(),
            'estado_che' => EstadoCheckoutSesionEnum::PAGO_REGISTRADO,
            'email_contacto_che' => $this->cliente->email,
            'telefono_contacto_che' => '12345678',
        ]);

        $pedidoTienda = PedidoTienda::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_checkout_sesion' => $checkoutSesion->cod_checkout_sesion,
            'user_id' => $this->cliente->id,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'estado_pte' => EstadoPedidoTiendaEnum::PENDIENTE_VALIDACION_PAGO,
        ]);

        $pago = Pago::create([
            'cod_pedido' => $pedido->cod_pedido,
            'estado_pago_pag' => 'pendiente',
            'monto_pag' => 200.00,
            'metodo_pago_pag' => 'transferencia',
            'fecha_pago_pag' => now()->toDateString(),
        ]);

        $this->pagoTienda = PagoTienda::create([
            'cod_pago' => $pago->cod_pago,
            'cod_checkout_sesion' => $checkoutSesion->cod_checkout_sesion,
            'user_id' => $this->cliente->id,
            'banco_origen_pwe' => 'BNB',
        ]);

        ComprobantePagoTienda::create([
            'cod_pago_tienda' => $this->pagoTienda->cod_pago_tienda,
            'ruta_comprobante_cpt' => 'comprobantes/test1.jpg',
            'hash_comprobante_cpt' => hash('sha256', 'test1'),
            'mime_cpt' => 'image/jpeg',
            'tamano_bytes_cpt' => 1024,
            'estado_cpt' => 'aceptado',
            'subido_por_user_id' => $this->cliente->id,
            'revisado_por_user_id' => $this->admin->id,
            'subido_en_cpt' => now(),
            'revisado_en_cpt' => now(),
        ]);

        ComprobantePagoTienda::create([
            'cod_pago_tienda' => $this->pagoTienda->cod_pago_tienda,
            'ruta_comprobante_cpt' => 'comprobantes/test2.jpg',
            'hash_comprobante_cpt' => hash('sha256', 'test2'),
            'mime_cpt' => 'image/jpeg',
            'tamano_bytes_cpt' => 2048,
            'estado_cpt' => 'pendiente',
            'subido_por_user_id' => $this->cliente->id,
            'subido_en_cpt' => now(),
        ]);
    }

    public function test_admin_ve_historial_comprobantes(): void
    {
        $pago = $this->pagoTienda->pago;

        $response = $this->actingAs($this->admin)->getJson(
            "/admin/tienda/pagos/{$pago->cod_pago}"
        );

        $response->assertStatus(200);

        $comprobantes = $response->json('comprobantes');
        $this->assertCount(2, $comprobantes);
    }

    public function test_cliente_ve_historial_comprobantes(): void
    {
        $pedido = $this->pagoTienda->checkoutSesion->pedidoTienda->pedido;

        $response = $this->actingAs($this->cliente)->getJson(
            "/tienda/mis-pedidos/{$pedido->cod_pedido}"
        );

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'comprobantes',
        ]);
    }

    public function test_comprobante_tiene_datos_completos(): void
    {
        $pago = $this->pagoTienda->pago;

        $response = $this->actingAs($this->admin)->getJson(
            "/admin/tienda/pagos/{$pago->cod_pago}"
        );

        $comprobante = $response->json('comprobantes')[0];
        $this->assertArrayHasKey('intento', $comprobante);
        $this->assertArrayHasKey('fecha_subida', $comprobante);
        $this->assertArrayHasKey('archivo', $comprobante);
        $this->assertArrayHasKey('estado', $comprobante);
        $this->assertArrayHasKey('observacion', $comprobante);
        $this->assertArrayHasKey('revisado_por', $comprobante);
        $this->assertArrayHasKey('fecha_revision', $comprobante);
    }
}
