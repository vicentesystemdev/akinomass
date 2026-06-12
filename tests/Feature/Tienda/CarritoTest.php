<?php

namespace Tests\Feature\Tienda;

use App\Models\CategoriaProducto;
use App\Models\DetalleCarrito;
use App\Models\Inventario;
use App\Models\Producto;
use App\Models\ReservaStockCarrito;
use App\Models\TallaProducto;
use App\Models\VarianteProducto;

class CarritoTest extends TiendaTestCase
{
    private Producto $producto;

    private Inventario $inventario;

    protected function setUp(): void
    {
        parent::setUp();

        $categoria = CategoriaProducto::create([
            'nombre_cat' => 'Test',
            'activo_cat' => true,
        ]);

        $this->producto = Producto::create([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Test',
            'precio_venta_pro' => 100.00,
            'sku_pro' => 'TEST-001',
            'estado_pro' => 'activo',
        ]);

        $this->inventario = Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'stock_actual_inv' => 10,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);
    }

    public function test_agregar_item_crea_carrito(): void
    {
        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'mensaje',
            'detalle',
            'carrito',
        ]);
    }

    public function test_agregar_producto_inactivo_falla(): void
    {
        $this->producto->update(['estado_pro' => 'inactivo']);

        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 1,
        ]);

        $response->assertStatus(422);
    }

    public function test_cantidad_mayor_a_stock_falla(): void
    {
        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 20,
        ]);

        $response->assertStatus(422);
    }

    public function test_actualizar_cantidad(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->patchJson('/tienda/carrito/items/'.$this->producto->cod_producto, [
            'cantidad' => 5,
        ]);

        $response->assertStatus(200);
    }

    public function test_eliminar_item(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->deleteJson('/tienda/carrito/items/'.$this->producto->cod_producto);

        $response->assertStatus(200);
    }

    public function test_vaciar_carrito(): void
    {
        $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 2,
        ]);

        $response = $this->deleteJson('/tienda/carrito');

        $response->assertStatus(200);
    }

    public function test_producto_con_variantes_requiere_seleccionar_talla(): void
    {
        $this->crearVariante('S', 5);

        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cantidad' => 1,
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('cod_variante_producto');
    }

    public function test_variante_con_stock_se_agrega_y_reserva_por_variante(): void
    {
        $variante = $this->crearVariante('M', 3);

        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'cantidad' => 2,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('detalles_carrito', [
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'cantidad_dca' => 2,
        ]);
        $this->assertDatabaseHas('reservas_stock_carrito', [
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'cantidad_res' => 2,
        ]);
    }

    public function test_variante_sin_stock_no_se_puede_agregar(): void
    {
        $variante = $this->crearVariante('L', 0);

        $response = $this->postJson('/tienda/carrito/items', [
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'cantidad' => 1,
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('cantidad');
    }

    public function test_dos_variantes_del_mismo_producto_generan_lineas_separadas(): void
    {
        $varianteS = $this->crearVariante('S', 5);
        $varianteM = $this->crearVariante('M', 5);

        foreach ([$varianteS, $varianteM] as $variante) {
            $this->postJson('/tienda/carrito/items', [
                'cod_producto' => $this->producto->cod_producto,
                'cod_variante_producto' => $variante->cod_variante_producto,
                'cantidad' => 1,
            ])->assertStatus(200);
        }

        $this->assertSame(2, DetalleCarrito::where('cod_producto', $this->producto->cod_producto)->count());
        $this->assertSame(2, ReservaStockCarrito::where('cod_producto', $this->producto->cod_producto)->count());
    }

    private function crearVariante(string $codigoTalla, int $stock): VarianteProducto
    {
        $talla = TallaProducto::create([
            'codigo_talla_producto' => $codigoTalla,
            'nom_talla_producto' => $codigoTalla,
            'tipo_talla_producto' => 'ropa',
            'orden_talla_producto' => 1,
            'activo_talla_producto' => true,
        ]);
        $variante = VarianteProducto::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_talla_producto' => $talla->cod_talla_producto,
            'sku_variante_producto' => "TEST-001-{$codigoTalla}",
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);
        Inventario::create([
            'cod_producto' => $this->producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'stock_actual_inv' => $stock,
            'stock_minimo_inv' => 0,
            'activo_inv' => true,
        ]);

        return $variante;
    }
}
