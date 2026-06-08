<?php

namespace Tests\Feature\Admin;

use App\Models\CanalVenta;
use App\Models\CategoriaProducto;
use App\Models\Cliente;
use App\Models\Inventario;
use App\Models\Producto;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class AdminTestCase extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);

        $this->admin = User::factory()->create(['email_verified_at' => now()]);
        $this->admin->assignRole('Administrador');
    }

    protected function crearCliente(array $attributes = []): Cliente
    {
        $canal = CanalVenta::firstOrCreate(
            ['codigo_can' => 'web'],
            ['nombre_can' => 'Web', 'activo_can' => true],
        );

        $flujo = TipoFlujoComercial::firstOrCreate(
            ['codigo_tip' => 'compra_web'],
            ['nombre_tip' => 'Compra Web', 'activo_tip' => true],
        );

        return Cliente::create(array_merge([
            'nombre_cli' => 'Cliente Test',
            'correo_cli' => 'cliente@test.com',
            'estado_cli' => 'activo',
            'cod_canal_venta' => $canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
        ], $attributes));
    }

    protected function crearCategoria(array $attributes = []): CategoriaProducto
    {
        return CategoriaProducto::create(array_merge([
            'nombre_cat' => 'Categoria Test',
            'activo_cat' => true,
        ], $attributes));
    }

    protected function crearProducto(?CategoriaProducto $categoria = null, array $attributes = []): Producto
    {
        $categoria ??= $this->crearCategoria();

        return Producto::create(array_merge([
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_pro' => 'Producto Test',
            'precio_venta_pro' => 100.00,
            'precio_costo_pro' => 50.00,
            'sku_pro' => 'TEST-001',
            'estado_pro' => 'activo',
        ], $attributes));
    }

    protected function crearInventario(Producto $producto, int $stock = 10): Inventario
    {
        return Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'stock_actual_inv' => $stock,
            'stock_minimo_inv' => 2,
            'activo_inv' => true,
        ]);
    }

    protected function crearProductoConStock(int $stock = 10, array $productoAttrs = []): array
    {
        $producto = $this->crearProducto(attributes: $productoAttrs);
        $inventario = $this->crearInventario($producto, $stock);

        return [$producto, $inventario];
    }

    protected function crearCanalVenta(array $attributes = []): CanalVenta
    {
        return CanalVenta::firstOrCreate(
            ['codigo_can' => $attributes['codigo_can'] ?? 'web'],
            array_merge(['nombre_can' => 'Web', 'activo_can' => true], $attributes),
        );
    }

    protected function crearTipoFlujo(array $attributes = []): TipoFlujoComercial
    {
        return TipoFlujoComercial::firstOrCreate(
            ['codigo_tip' => $attributes['codigo_tip'] ?? 'compra_web'],
            array_merge(['nombre_tip' => 'Compra Web', 'activo_tip' => true], $attributes),
        );
    }
}
