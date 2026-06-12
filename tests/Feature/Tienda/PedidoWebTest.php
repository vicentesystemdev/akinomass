<?php

namespace Tests\Feature\Tienda;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Models\CanalVenta;
use App\Models\Carrito;
use App\Models\CategoriaProducto;
use App\Models\CheckoutSesion;
use App\Models\Cliente;
use App\Models\CuentaCliente;
use App\Models\DetalleCarrito;
use App\Models\DetallePedido;
use App\Models\Inventario;
use App\Models\Producto;
use App\Models\TallaProducto;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use App\Models\VarianteProducto;

class PedidoWebTest extends TiendaTestCase
{
    private User $user;

    private Cliente $cliente;

    private CuentaCliente $cuentaCliente;

    private Carrito $carrito;

    private CheckoutSesion $checkoutSesion;

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
            'estado_car' => EstadoCarritoEnum::EN_CHECKOUT,
            'moneda_car' => 'BOB',
            'subtotal_car' => 200,
            'total_car' => 200,
        ]);

        $categoria = CategoriaProducto::create(['nombre_cat' => 'Test', 'activo_cat' => true]);
        $producto = Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Test',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'TEST-001',
            'estado_pro' => 'activo',
        ]);

        Inventario::create(['cod_producto' => $producto->cod_producto, 'stock_actual_inv' => 10, 'activo_inv' => true]);

        DetalleCarrito::create([
            'cod_carrito' => $this->carrito->cod_carrito,
            'cod_producto' => $producto->cod_producto,
            'cantidad_dca' => 2,
            'precio_unitario_dca' => 100.00,
            'subtotal_dca' => 200.00,
            'nombre_producto_dca' => 'Producto Test',
            'sku_producto_dca' => 'TEST-001',
        ]);

        $this->checkoutSesion = CheckoutSesion::create([
            'cod_cuenta_cliente' => $this->cuentaCliente->cod_cuenta_cliente,
            'cod_carrito' => $this->carrito->cod_carrito,
            'estado_che' => EstadoCheckoutSesionEnum::DATOS_COMPLETADOS,
            'email_contacto_che' => 'test@example.com',
            'subtotal_che' => 200,
            'total_che' => 200,
        ]);
    }

    public function test_generar_pedido_requiere_auth(): void
    {
        $response = $this->postJson('/tienda/checkout/'.$this->checkoutSesion->token_che.'/generar-pedido');

        $response->assertStatus(401);
    }

    public function test_generar_pedido_crea_pedido_tienda(): void
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/tienda/checkout/'.$this->checkoutSesion->token_che.'/generar-pedido', [
            'cod_checkout_sesion' => $this->checkoutSesion->cod_checkout_sesion,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['mensaje', 'pedido']);
    }

    public function test_checkout_sin_datos_completados_falla(): void
    {
        $this->checkoutSesion->update(['estado_che' => EstadoCheckoutSesionEnum::INICIADO]);

        $this->actingAs($this->user);

        $response = $this->postJson('/tienda/checkout/'.$this->checkoutSesion->token_che.'/generar-pedido', [
            'cod_checkout_sesion' => $this->checkoutSesion->cod_checkout_sesion,
        ]);

        $response->assertStatus(422);
    }

    public function test_listar_pedidos_cliente(): void
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/tienda/mis-pedidos');

        $response->assertStatus(200);
    }

    public function test_ver_pedido_cliente(): void
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/tienda/mis-pedidos/1');

        $response->assertStatus(404);
    }

    public function test_pedido_persiste_variante_seleccionada(): void
    {
        $detalleCarrito = $this->carrito->detalles()->firstOrFail();
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'M',
            'nom_talla_producto' => 'M',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 1,
            'activo_talla_producto' => true,
        ]);
        $variante = VarianteProducto::create([
            'cod_producto' => $detalleCarrito->cod_producto,
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'TEST-001-M',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);
        Inventario::create([
            'cod_producto' => $detalleCarrito->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'stock_actual_inv' => 10,
            'stock_minimo_inv' => 0,
            'activo_inv' => true,
        ]);
        $detalleCarrito->update(['cod_variante_producto' => $variante->cod_variante_producto]);

        $this->actingAs($this->user);
        $this->postJson('/tienda/checkout/'.$this->checkoutSesion->token_che.'/generar-pedido', [
            'cod_checkout_sesion' => $this->checkoutSesion->cod_checkout_sesion,
        ])->assertStatus(200);

        $this->assertTrue(DetallePedido::where('cod_variante_producto', $variante->cod_variante_producto)->exists());
    }
}
