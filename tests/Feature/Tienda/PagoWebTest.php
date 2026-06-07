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
use App\Models\PagoTienda;
use App\Models\TipoFlujoComercial;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PagoWebTest extends TiendaTestCase
{
    private $user;
    private CheckoutSesion $checkoutSesion;
    private PedidoTienda $pedidoTienda;
    private Pedido $pedido;

    protected function setUp(): void
    {
        parent::setUp();

        $user = $this->crearUsuarioCliente();

        $cliente = Cliente::create([
            'nombre_cli' => 'Test Cliente',
            'correo_cli' => $user->email,
            'estado_cli' => 'activo',
            'cod_canal_venta' => CanalVenta::first()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => TipoFlujoComercial::first()->cod_tipo_flujo_comercial,
        ]);

        $cuentaCliente = CuentaCliente::create([
            'user_id' => $user->id,
            'cod_cliente' => $cliente->cod_cliente,
            'estado_cue' => 'activa',
            'fecha_activacion_cue' => now(),
        ]);

        $carrito = Carrito::create([
            'user_id' => $user->id,
            'cod_cliente' => $cliente->cod_cliente,
            'estado_car' => EstadoCarritoEnum::CONVERTIDO,
            'moneda_car' => 'BOB',
            'subtotal_car' => 200,
            'total_car' => 200,
        ]);

        $this->checkoutSesion = CheckoutSesion::create([
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'cod_carrito' => $carrito->cod_carrito,
            'estado_che' => EstadoCheckoutSesionEnum::PEDIDO_GENERADO,
            'email_contacto_che' => 'test@example.com',
            'subtotal_che' => 200,
            'total_che' => 200,
        ]);

        $this->pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => CanalVenta::first()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => TipoFlujoComercial::first()->cod_tipo_flujo_comercial,
            'numero_pedido_ped' => 'PED-WEB-001',
            'fecha_pedido_ped' => now()->toDateString(),
            'estado_ped' => 'borrador',
            'subtotal_ped' => 200,
            'descuento_ped' => 0,
            'total_ped' => 200,
        ]);

        $this->pedidoTienda = PedidoTienda::create([
            'cod_pedido' => $this->pedido->cod_pedido,
            'cod_checkout_sesion' => $this->checkoutSesion->cod_checkout_sesion,
            'user_id' => $user->id,
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'estado_pte' => EstadoPedidoTiendaEnum::PENDIENTE_PAGO,
        ]);

        $this->user = $user;
    }

    public function test_registrar_pago_requiere_auth(): void
    {
        $response = $this->postJson('/tienda/checkout/' . $this->checkoutSesion->token_che . '/pago', [
            'cod_checkout_sesion' => $this->checkoutSesion->cod_checkout_sesion,
            'metodo_pago_pag' => 'qr',
            'comprobante' => UploadedFile::fake()->create('comprobante.pdf', 100, 'application/pdf'),
        ]);

        $response->assertStatus(401);
    }

    public function test_registrar_pago_crea_pago_tienda(): void
    {
        Storage::fake('local');
        $this->actingAs($this->user);

        $comprobante = UploadedFile::fake()->create('comprobante.pdf', 100, 'application/pdf');

        $response = $this->post('/tienda/checkout/' . $this->checkoutSesion->token_che . '/pago', [
            'cod_checkout_sesion' => $this->checkoutSesion->cod_checkout_sesion,
            'metodo_pago_pag' => 'qr',
            'referencia_pag' => 'REF-123',
            'comprobante' => $comprobante,
        ], [
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['mensaje', 'pago']);

        $pagoTienda = PagoTienda::where('cod_checkout_sesion', $this->checkoutSesion->cod_checkout_sesion)->first();
        $this->assertNotNull($pagoTienda?->comprobante_ruta_pwe);
        Storage::disk('local')->assertExists($pagoTienda->comprobante_ruta_pwe);
    }

    public function test_registrar_pago_desde_pedido_pendiente_revision(): void
    {
        Storage::fake('local');
        $this->actingAs($this->user);

        $this->pedidoTienda->update([
            'estado_pte' => EstadoPedidoTiendaEnum::PENDIENTE_REVISION,
        ]);

        $response = $this->post('/tienda/checkout/' . $this->checkoutSesion->token_che . '/pago', [
            'cod_checkout_sesion' => $this->checkoutSesion->cod_checkout_sesion,
            'metodo_pago_pag' => 'qr',
            'comprobante' => UploadedFile::fake()->create('comprobante.pdf', 100, 'application/pdf'),
        ], [
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(200);

        $this->pedidoTienda->refresh();
        $this->assertEquals(EstadoPedidoTiendaEnum::PENDIENTE_VALIDACION_PAGO, $this->pedidoTienda->estado_pte);
    }

    public function test_estado_pedido_tienda_permite_pendiente_validacion_pago(): void
    {
        DB::table('pedidos_tienda')
            ->where('cod_pedido_tienda', $this->pedidoTienda->cod_pedido_tienda)
            ->update(['estado_pte' => EstadoPedidoTiendaEnum::PENDIENTE_VALIDACION_PAGO->value]);

        $this->pedidoTienda->refresh();

        $this->assertEquals(EstadoPedidoTiendaEnum::PENDIENTE_VALIDACION_PAGO, $this->pedidoTienda->estado_pte);
    }

    public function test_registrar_pago_sin_comprobante_falla(): void
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/tienda/checkout/' . $this->checkoutSesion->token_che . '/pago', [
            'cod_checkout_sesion' => $this->checkoutSesion->cod_checkout_sesion,
            'metodo_pago_pag' => 'qr',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['comprobante']);
    }

    public function test_metodo_pago_invalido_falla(): void
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/tienda/checkout/' . $this->checkoutSesion->token_che . '/pago', [
            'cod_checkout_sesion' => $this->checkoutSesion->cod_checkout_sesion,
            'metodo_pago_pag' => 'bitcoin',
        ]);

        $response->assertStatus(422);
    }

    public function test_ver_pago_cliente_sin_pago_registrado(): void
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/tienda/mis-pedidos/' . $this->pedido->cod_pedido . '/pago');

        $response->assertStatus(404);
    }
}
