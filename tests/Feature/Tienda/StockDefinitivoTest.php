<?php

namespace Tests\Feature\Tienda;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Carrito\Enums\EstadoReservaStockEnum;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\PagosWeb\Actions\DescontarStockDefinitivoPedidoWebAction;
use App\Models\Carrito;
use App\Models\CategoriaProducto;
use App\Models\DetalleCarrito;
use App\Models\DetallePedido;
use App\Models\Inventario;
use App\Models\Pedido;
use App\Models\PedidoTienda;
use App\Models\Producto;
use App\Models\ReservaStockCarrito;
use App\Models\TallaProducto;
use App\Models\User;
use App\Models\VarianteProducto;

class StockDefinitivoTest extends TiendaTestCase
{
    private Inventario $inventario;

    private Producto $producto;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['email_verified_at' => now()]);
        $this->admin->assignRole('Administrador');

        $categoria = CategoriaProducto::create([
            'nombre_cat' => 'Test',
            'activo_cat' => true,
        ]);

        $this->producto = Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Stock Definitivo',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'STK-001',
            'estado_pro' => 'activo',
        ]);

        $this->inventario = Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'stock_actual_inv' => 10,
            'stock_minimo_inv' => 2,
            'activo_inv' => true,
        ]);
    }

    public function test_stock_fisico_no_cambia_hasta_pago_aceptado(): void
    {
        $stockAntes = $this->inventario->stock_actual_inv;

        $user = $this->crearUsuarioCliente();

        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 3,
        ]);

        $this->inventario->refresh();
        $this->assertEquals($stockAntes, $this->inventario->stock_actual_inv);
    }

    public function test_reserva_activa_no_cambia_stock_fisico(): void
    {
        $user = $this->crearUsuarioCliente();

        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $reserva = ReservaStockCarrito::where('cod_producto', $this->producto->cod_producto)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->first();

        $this->assertNotNull($reserva);

        $this->inventario->refresh();
        $this->assertEquals(10, $this->inventario->stock_actual_inv);
    }

    public function test_stock_disponible_considera_reservas(): void
    {
        $user = $this->crearUsuarioCliente();

        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 3,
        ]);

        $reservasService = app(ReservaStockCarritoService::class);
        $reservado = $reservasService->sumarReservasActivasPorProducto($this->producto->cod_producto);

        $this->assertEquals(3, $reservado);

        $stockDisponible = $this->inventario->stock_actual_inv - $reservado;
        $this->assertEquals(7, $stockDisponible);
    }

    public function test_expiracion_reserva_libera_stock_disponible(): void
    {
        $user = $this->crearUsuarioCliente();

        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 3,
        ]);

        $reserva = ReservaStockCarrito::where('cod_producto', $this->producto->cod_producto)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->first();

        $reserva->update([
            'expira_en_res' => now()->subMinute(),
        ]);

        $reservasService = app(ReservaStockCarritoService::class);
        $reservado = $reservasService->sumarReservasActivasPorProducto($this->producto->cod_producto);

        $this->assertEquals(0, $reservado);
    }

    public function test_pago_aceptado_descuenta_inventario_de_variante_y_no_el_base(): void
    {
        $talla = TallaProducto::create([
            'codigo_talla_producto' => 'M',
            'nom_talla_producto' => 'M',
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 1,
            'activo_talla_producto' => true,
        ]);
        $variante = VarianteProducto::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => 'STK-001-M',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);
        $inventarioVariante = Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'stock_actual_inv' => 6,
            'stock_minimo_inv' => 0,
            'activo_inv' => true,
        ]);
        $carrito = Carrito::create([
            'session_id_car' => 'pago-variante',
            'estado_car' => EstadoCarritoEnum::CONVERTIDO,
            'moneda_car' => 'BOB',
            'subtotal_car' => 200,
            'total_car' => 200,
        ]);
        DetalleCarrito::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'cantidad_dca' => 2,
            'precio_unitario_dca' => 100,
            'subtotal_dca' => 200,
            'nombre_producto_dca' => $this->producto->nombre_pro,
            'sku_producto_dca' => $variante->sku_variante_producto,
        ]);
        $detallePedido = new DetallePedido([
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'cantidad_det' => 2,
            'precio_unitario_det' => 100,
            'subtotal_det' => 200,
        ]);
        $detallePedido->setRelation('producto', $this->producto);
        $pedido = new Pedido(['numero_pedido_ped' => 'PED-TEST']);
        $pedido->setRelation('detalles', collect([$detallePedido]));
        $pedidoTienda = new PedidoTienda(['cod_pedido' => 999]);
        $pedidoTienda->setRelation('pedido', $pedido);

        app(DescontarStockDefinitivoPedidoWebAction::class)->execute($pedidoTienda, $carrito->load('detalles'));

        $this->assertSame(4, (int) $inventarioVariante->fresh()->stock_actual_inv);
        $this->assertSame(10, (int) $this->inventario->fresh()->stock_actual_inv);
    }
}
