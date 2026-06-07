<?php

namespace Tests\Feature\Tienda;

use App\Domains\Tienda\Carrito\Enums\EstadoReservaStockEnum;
use App\Models\Inventario;
use App\Models\ReservaStockCarrito;
use App\Models\User;

class StockDefinitivoTest extends TiendaTestCase
{
    private Inventario $inventario;
    private \App\Models\Producto $producto;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['email_verified_at' => now()]);
        $this->admin->assignRole('Administrador');

        $categoria = \App\Models\CategoriaProducto::create([
            'nombre_cat' => 'Test',
            'activo_cat' => true,
        ]);

        $this->producto = \App\Models\Producto::create([
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

        $reservasService = app(\App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService::class);
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

        $reservasService = app(\App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService::class);
        $reservado = $reservasService->sumarReservasActivasPorProducto($this->producto->cod_producto);

        $this->assertEquals(0, $reservado);
    }
}
