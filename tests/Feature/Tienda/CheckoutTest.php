<?php

namespace Tests\Feature\Tienda;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Carrito\Enums\EstadoReservaStockEnum;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Models\CanalVenta;
use App\Models\Carrito;
use App\Models\CategoriaProducto;
use App\Models\Cliente;
use App\Models\CuentaCliente;
use App\Models\DetalleCarrito;
use App\Models\Inventario;
use App\Models\Producto;
use App\Models\ReservaStockCarrito;
use App\Models\TipoFlujoComercial;
use App\Models\User;

class CheckoutTest extends TiendaTestCase
{

    private User $user;
    private Cliente $cliente;
    private CuentaCliente $cuentaCliente;
    private Carrito $carrito;
    private Producto $producto;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = $this->crearUsuarioCliente();

        $this->cliente = Cliente::create([
            'nombre_cli' => 'Test Cliente',
            'correo_cli' => $this->user->email,
            'estado_cli' => 'activo',
            'cod_canal_venta' => CanalVenta::first()->cod_canal_venta,
            'cod_tipo_flujo_comercial' => TipoFlujoComercial::first()->cod_tipo_flujo_comercial,
        ]);

        $this->cuentaCliente = CuentaCliente::create([
            'user_id' => $this->user->id,
            'cod_cliente' => $this->cliente->cod_cliente,
            'estado_cue' => 'activa',
            'fecha_activacion_cue' => now(),
        ]);

        $this->carrito = Carrito::create([
            'user_id' => $this->user->id,
            'cod_cliente' => $this->cliente->cod_cliente,
            'estado_car' => EstadoCarritoEnum::ACTIVO,
            'moneda_car' => 'BOB',
            'subtotal_car' => 0,
            'total_car' => 0,
        ]);

        $categoria = CategoriaProducto::create(['nombre_cat' => 'Test', 'activo_cat' => true]);

        $this->producto = Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Test',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'TEST-001',
            'estado_pro' => 'activo',
        ]);

        Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'stock_actual_inv' => 10,
            'activo_inv' => true,
        ]);

        DetalleCarrito::create([
            'cod_carrito' => $this->carrito->cod_carrito,
            'cod_producto' => $this->producto->cod_producto,
            'cantidad_dca' => 2,
            'precio_unitario_dca' => 100.00,
            'subtotal_dca' => 200.00,
            'nombre_producto_dca' => 'Producto Test',
            'sku_producto_dca' => 'TEST-001',
        ]);

        $detalle = $this->carrito->detalles()->first();
        ReservaStockCarrito::create([
            'cod_carrito' => $this->carrito->cod_carrito,
            'cod_detalle_carrito' => $detalle->cod_detalle_carrito,
            'cod_producto' => $this->producto->cod_producto,
            'user_id' => $this->user->id,
            'cantidad_res' => 2,
            'estado_res' => EstadoReservaStockEnum::ACTIVA,
            'expira_en_res' => now()->addMinutes(20),
        ]);
    }

    public function test_iniciar_checkout_requiere_auth(): void
    {
        $response = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $response->assertStatus(401);
    }

    public function test_iniciar_checkout_crea_sesion(): void
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'mensaje',
            'checkout',
            'token',
        ]);
    }

    public function test_iniciar_checkout_renueva_reservas_vencidas_si_hay_stock(): void
    {
        ReservaStockCarrito::where('cod_carrito', $this->carrito->cod_carrito)
            ->update(['expira_en_res' => now()->subMinute()]);

        $this->actingAs($this->user);

        $response = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $response->assertStatus(200);

        $reserva = ReservaStockCarrito::where('cod_carrito', $this->carrito->cod_carrito)->first();
        $this->assertTrue($reserva->expira_en_res->isFuture());
    }

    public function test_carrito_vacio_falla(): void
    {
        $this->carrito->detalles()->delete();

        $this->actingAs($this->user);

        $response = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $response->assertStatus(422);
    }

    public function test_ver_checkout_con_token(): void
    {
        $this->actingAs($this->user);

        $crearResponse = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $token = $crearResponse->json('token');

        $response = $this->getJson('/tienda/checkout/' . $token);

        $response->assertStatus(200);
    }

    public function test_actualizar_datos_checkout(): void
    {
        $this->actingAs($this->user);

        $crearResponse = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $token = $crearResponse->json('token');

        $response = $this->patchJson('/tienda/checkout/' . $token . '/datos', [
            'email_contacto' => 'test@example.com',
            'telefono_contacto' => '12345678',
        ]);

        $response->assertStatus(200);
    }

    public function test_cancelar_checkout(): void
    {
        $this->actingAs($this->user);

        $crearResponse = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $token = $crearResponse->json('token');

        $response = $this->postJson('/tienda/checkout/' . $token . '/cancelar');

        $response->assertStatus(200);

        $this->carrito->refresh();
        $this->assertEquals(EstadoCarritoEnum::ACTIVO, $this->carrito->estado_car);
    }
}
