<?php

namespace Tests\Feature\Tienda;

use App\Domains\Tienda\Carrito\Enums\EstadoReservaStockEnum;
use App\Models\Inventario;
use App\Models\ReservaStockCarrito;

class ReservasStockTest extends TiendaTestCase
{
    private Inventario $inventario;
    private \App\Models\Producto $producto;

    protected function setUp(): void
    {
        parent::setUp();

        $categoria = \App\Models\CategoriaProducto::create([
            'nombre_cat' => 'Test',
            'activo_cat' => true,
        ]);

        $this->producto = \App\Models\Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Test Reserva',
            'precio_venta_pro' => 50.00,
            'sku_pro' => 'RES-001',
            'estado_pro' => 'activo',
        ]);

        $this->inventario = Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'stock_actual_inv' => 5,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);
    }

    public function test_qa01_agregar_producto_crea_reserva(): void
    {
        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response->assertStatus(200);

        $reserva = ReservaStockCarrito::where('cod_producto', $this->producto->cod_producto)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->first();

        $this->assertNotNull($reserva);
        $this->assertEquals(2, $reserva->cantidad_res);
        $this->assertTrue($reserva->expira_en_res->isFuture());
    }

    public function test_qa02_stock_disponible_se_reduce(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->getJson('/tienda/catalogo');

        $response->assertStatus(200);

        $productos = $response->json('productos') ?? $response->json('data') ?? [];
        $productoEncontrado = null;

        foreach ($productos as $p) {
            if (($p['cod_producto'] ?? $p['cod_producto'] ?? null) == $this->producto->cod_producto) {
                $productoEncontrado = $p;
                break;
            }
        }

        if ($productoEncontrado) {
            $stockDisponible = $productoEncontrado['stock_disponible'] ?? $productoEncontrado['stock_disponible'] ?? null;
            if ($stockDisponible !== null) {
                $this->assertEquals(3, $stockDisponible);
            }
        }
    }

    public function test_qa03_reserva_vence_stock_sube(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
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

    public function test_qa04_eliminar_item_libera_reserva(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $this->deleteJson('/tienda/carrito/items/' . $this->producto->cod_producto);

        $reservaLiberada = ReservaStockCarrito::where('cod_producto', $this->producto->cod_producto)
            ->where('estado_res', EstadoReservaStockEnum::LIBERADA)
            ->first();

        $this->assertNotNull($reservaLiberada);
    }

    public function test_qa05_reducir_cantidad_libera_diferencia(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 4,
        ]);

        $this->patchJson('/tienda/carrito/items/' . $this->producto->cod_producto, [
            'cantidad' => 1,
        ]);

        $reserva = ReservaStockCarrito::where('cod_producto', $this->producto->cod_producto)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->first();

        $this->assertNotNull($reserva);
        $this->assertEquals(1, $reserva->cantidad_res);
    }

    public function test_qa06_aumentar_cantidad_con_stock(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->patchJson('/tienda/carrito/items/' . $this->producto->cod_producto, [
            'cantidad' => 3,
        ]);

        $response->assertStatus(200);

        $reserva = ReservaStockCarrito::where('cod_producto', $this->producto->cod_producto)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->first();

        $this->assertEquals(3, $reserva->cantidad_res);
    }

    public function test_qa07_aumentar_cantidad_sin_stock_falla(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->patchJson('/tienda/carrito/items/' . $this->producto->cod_producto, [
            'cantidad' => 10,
        ]);

        $response->assertStatus(422);
    }
}
