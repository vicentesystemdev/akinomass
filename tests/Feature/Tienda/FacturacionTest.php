<?php

namespace Tests\Feature\Tienda;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\Facturacion\Enums\EstadoFacturaEnum;
use App\Domains\Tienda\Facturacion\Enums\TipoComprobanteEnum;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Models\CanalVenta;
use App\Models\Carrito;
use App\Models\CategoriaProducto;
use App\Models\CheckoutSesion;
use App\Models\Cliente;
use App\Models\CuentaCliente;
use App\Models\DetallePedido;
use App\Models\Factura;
use App\Models\Inventario;
use App\Models\Pedido;
use App\Models\PedidoTienda;
use App\Models\Producto;
use App\Models\TipoFlujoComercial;
use App\Models\User;

class FacturacionTest extends TiendaTestCase
{

    private User $user;
    private Pedido $pedido;
    private PedidoTienda $pedidoTienda;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = $this->crearUsuarioCliente();

        $cliente = Cliente::create([
            'nombre_cli' => 'Test Cliente',
            'correo_cli' => $this->user->email,
            'estado_cli' => 'activo',
            'cod_canal_venta' => CanalVenta::first()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => TipoFlujoComercial::first()->cod_tipo_flujo_comercial,
        ]);

        $cuentaCliente = CuentaCliente::create([
            'user_id' => $this->user->id,
            'cod_cliente' => $cliente->cod_cliente,
            'estado_cue' => 'activa',
            'fecha_activacion_cue' => now(),
        ]);

        $carrito = Carrito::create([
            'user_id' => $this->user->id,
            'cod_cliente' => $cliente->cod_cliente,
            'estado_car' => EstadoCarritoEnum::CONVERTIDO,
            'moneda_car' => 'BOB',
            'subtotal_car' => 200,
            'total_car' => 200,
        ]);

        $checkoutSesion = CheckoutSesion::create([
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'cod_carrito' => $carrito->cod_carrito,
            'estado_che' => EstadoCheckoutSesionEnum::PAGO_CONFIRMADO,
            'email_contacto_che' => 'test@example.com',
            'subtotal_che' => 200,
            'total_che' => 200,
        ]);

        $this->pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => CanalVenta::first()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => TipoFlujoComercial::first()->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-000001',
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => 'confirmado',
            'subtotal_ped' => 200,
            'descuento_ped' => 0,
            'total_ped' => 200,
        ]);

        $categoria = CategoriaProducto::create(['nombre_cat' => 'Test', 'activo_cat' => true]);
        $producto = Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Test',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'TEST-001',
            'estado_pro' => 'activo',
        ]);

        DetallePedido::create([
            'cod_pedido' => $this->pedido->cod_pedido,
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 2,
            'precio_unitario_det' => 100.00,
            'subtotal_det' => 200.00,
        ]);

        $this->pedidoTienda = PedidoTienda::create([
            'cod_pedido' => $this->pedido->cod_pedido,
            'cod_checkout_sesion' => $checkoutSesion->cod_checkout_sesion,
            'user_id' => $this->user->id,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'estado_pte' => EstadoPedidoTiendaEnum::PAGADO,
        ]);
    }

    public function test_emitir_factura_crea_factura(): void
    {
        $action = app(\App\Domains\Tienda\Facturacion\Actions\EmitirFacturaDesdePedidoAction::class);

        $factura = $action->execute($this->pedido, $this->user->id);

        $this->assertNotNull($factura);
        $this->assertEquals(EstadoFacturaEnum::EMITIDA, $factura->estado_fac);
        $this->assertEquals($this->pedido->cod_pedido, $factura->cod_pedido);
    }

    public function test_factura_tiene_detalles(): void
    {
        $action = app(\App\Domains\Tienda\Facturacion\Actions\EmitirFacturaDesdePedidoAction::class);

        $factura = $action->execute($this->pedido, $this->user->id);

        $this->assertGreaterThan(0, $factura->detalles->count());
    }

    public function test_numero_factura_es_unico(): void
    {
        $action = app(\App\Domains\Tienda\Facturacion\Actions\EmitirFacturaDesdePedidoAction::class);

        $factura1 = $action->execute($this->pedido, $this->user->id);

        $this->assertNotNull($factura1->numero_factura_fac);
        $this->assertStringStartsWith('FAC-', $factura1->numero_factura_fac);
    }

    public function test_ver_factura_cliente(): void
    {
        $action = app(\App\Domains\Tienda\Facturacion\Actions\EmitirFacturaDesdePedidoAction::class);
        $factura = $action->execute($this->pedido, $this->user->id);

        $this->actingAs($this->user);

        $response = $this->getJson('/tienda/mis-pedidos/' . $this->pedido->cod_pedido . '/factura');

        $response->assertStatus(200);
    }

    public function test_anular_factura(): void
    {
        $action = app(\App\Domains\Tienda\Facturacion\Actions\EmitirFacturaDesdePedidoAction::class);
        $factura = $action->execute($this->pedido, $this->user->id);

        $anularAction = app(\App\Domains\Tienda\Facturacion\Actions\AnularFacturaAction::class);
        $facturaAnulada = $anularAction->execute($factura);

        $this->assertEquals(EstadoFacturaEnum::ANULADA, $facturaAnulada->estado_fac);
        $this->assertNotNull($facturaAnulada->anulada_en_fac);
    }
}
