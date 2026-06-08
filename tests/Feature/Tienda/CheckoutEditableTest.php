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

class CheckoutEditableTest extends TiendaTestCase
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
            'nombre_cli' => 'Test Cliente Checkout',
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
            'nombre_pro' => 'Producto Checkout',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'CHK-001',
            'estado_pro' => 'activo',
        ]);

        Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'stock_actual_inv' => 10,
            'activo_inv' => true,
        ]);

        $detalle = DetalleCarrito::create([
            'cod_carrito' => $this->carrito->cod_carrito,
            'cod_producto' => $this->producto->cod_producto,
            'cantidad_dca' => 2,
            'precio_unitario_dca' => 100.00,
            'subtotal_dca' => 200.00,
            'nombre_producto_dca' => 'Producto Checkout',
            'sku_producto_dca' => 'CHK-001',
        ]);

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

    public function test_qa08_iniciar_checkout_extiende_reservas(): void
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

        $checkout = $response->json('checkout');
        $this->assertArrayHasKey('tiempo_checkout', $checkout);
        $this->assertArrayHasKey('reservas', $checkout);
    }

    public function test_qa09_volver_al_carrito_mantiene_reservas(): void
    {
        $this->actingAs($this->user);

        $crearResponse = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $token = $crearResponse->json('token');

        $response = $this->postJson("/tienda/checkout/{$token}/volver-carrito");

        $response->assertStatus(200);
        $response->assertJson([
            'mensaje' => 'Has vuelto al carrito. Tus productos siguen reservados.',
        ]);
    }

    public function test_qa10_cancelar_compra_libera_reservas(): void
    {
        $this->actingAs($this->user);

        $crearResponse = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $token = $crearResponse->json('token');

        $response = $this->postJson("/tienda/checkout/{$token}/cancelar-compra");

        $response->assertStatus(200);
    }

    public function test_checkout_retorna_tiempo_restante(): void
    {
        $this->actingAs($this->user);

        $crearResponse = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $token = $crearResponse->json('token');

        $response = $this->getJson("/tienda/checkout/{$token}");

        $response->assertStatus(200);

        $checkout = $response->json('checkout');
        $this->assertArrayHasKey('tiempo_checkout', $checkout);
        $this->assertGreaterThan(0, $checkout['tiempo_checkout']['tiempo_restante_segundos']);
        $this->assertFalse($checkout['tiempo_checkout']['expirado']);
    }

    public function test_extender_reservas_checkout(): void
    {
        $this->actingAs($this->user);

        $crearResponse = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $token = $crearResponse->json('token');

        $response = $this->postJson("/tienda/checkout/{$token}/extender-reservas");

        $response->assertStatus(200);
    }

    public function test_cancelar_checkout(): void
    {
        $this->actingAs($this->user);

        $crearResponse = $this->postJson('/tienda/checkout', [
            'cod_carrito' => $this->carrito->cod_carrito,
        ]);

        $token = $crearResponse->json('token');

        $response = $this->postJson("/tienda/checkout/{$token}/cancelar");

        $response->assertStatus(200);

        $this->carrito->refresh();
        $this->assertEquals(EstadoCarritoEnum::ACTIVO, $this->carrito->estado_car);
    }
}
