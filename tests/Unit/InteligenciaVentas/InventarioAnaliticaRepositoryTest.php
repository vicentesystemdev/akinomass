<?php

declare(strict_types=1);

namespace Tests\Unit\InteligenciaVentas;

use App\Domains\InteligenciaVentas\Repositories\InventarioAnaliticaRepository;
use App\Domains\InteligenciaVentas\Services\InteligenciaVentasService;
use App\Models\ConfiguracionInteligenciaVentas;
use App\Models\DetallePedido;
use App\Models\Inventario;
use App\Models\Pedido;
use App\Models\PrediccionVenta;
use App\Models\TallaProducto;
use App\Models\VarianteProducto;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use Tests\Feature\Admin\AdminTestCase;

final class InventarioAnaliticaRepositoryTest extends AdminTestCase
{
    private InventarioAnaliticaRepository $repository;
    private TallaProducto $tallaS;
    private TallaProducto $tallaM;
    private TallaProducto $tallaL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new InventarioAnaliticaRepository();
        
        $this->tallaS = TallaProducto::create([
            'codigo_talla_producto' => 'S',
            'nom_talla_producto' => 'Talla S',
            'tipo_talla_producto' => 'letras',
            'activo_talla_producto' => true,
        ]);

        $this->tallaM = TallaProducto::create([
            'codigo_talla_producto' => 'M',
            'nom_talla_producto' => 'Talla M',
            'tipo_talla_producto' => 'letras',
            'activo_talla_producto' => true,
        ]);

        $this->tallaL = TallaProducto::create([
            'codigo_talla_producto' => 'L',
            'nom_talla_producto' => 'Talla L',
            'tipo_talla_producto' => 'letras',
            'activo_talla_producto' => true,
        ]);
    }

    public function test_stock_total_producto_suma_base_y_variantes(): void
    {
        // 1. Crear producto con inventario base
        $producto = $this->crearProducto(attributes: ['sku_pro' => 'PROD-CON-VAR']);
        
        // Inventario base (cod_variante_producto = null) con stock 5
        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => null,
            'stock_actual_inv' => 5,
            'stock_minimo_inv' => 2,
            'activo_inv' => true,
        ]);

        // 2. Crear variantes y sus inventarios
        
        // Variante S: activa, inventario activo (stock 10)
        $varianteS = VarianteProducto::create([
            'cod_producto' => $producto->cod_producto,
            'cod_talla_producto' => $this->tallaS->cod_talla_producto,
            'sku_variante_producto' => 'PROD-CON-VAR-S',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);

        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $varianteS->cod_variante_producto,
            'stock_actual_inv' => 10,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        // Variante M: activa, inventario inactivo (stock 20) -> no se debe sumar
        $varianteM = VarianteProducto::create([
            'cod_producto' => $producto->cod_producto,
            'cod_talla_producto' => $this->tallaM->cod_talla_producto,
            'sku_variante_producto' => 'PROD-CON-VAR-M',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);

        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $varianteM->cod_variante_producto,
            'stock_actual_inv' => 20,
            'stock_minimo_inv' => 1,
            'activo_inv' => false,
        ]);

        // Variante L: activa, inventario activo (stock 15) -> se debe sumar
        $varianteL = VarianteProducto::create([
            'cod_producto' => $producto->cod_producto,
            'cod_talla_producto' => $this->tallaL->cod_talla_producto,
            'sku_variante_producto' => 'PROD-CON-VAR-L',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);

        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $varianteL->cod_variante_producto,
            'stock_actual_inv' => 15,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        // Total esperado: 5 (base) + 10 (variante S) + 15 (variante L activo) = 30
        $this->assertEquals(30, $this->repository->stockTotalProducto($producto->cod_producto));
    }

    public function test_stock_total_producto_sin_variantes(): void
    {
        $producto = $this->crearProducto(attributes: ['sku_pro' => 'PROD-SIN-VAR']);
        
        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => null,
            'stock_actual_inv' => 8,
            'stock_minimo_inv' => 2,
            'activo_inv' => true,
        ]);

        $this->assertEquals(8, $this->repository->stockTotalProducto($producto->cod_producto));
    }

    public function test_stock_actual_mantiene_compatibilidad_con_variantes(): void
    {
        $producto = $this->crearProducto(attributes: ['sku_pro' => 'PROD-COMPAT']);
        
        // Inventario base stock 3
        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => null,
            'stock_actual_inv' => 3,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        $variante = VarianteProducto::create([
            'cod_producto' => $producto->cod_producto,
            'cod_talla_producto' => $this->tallaM->cod_talla_producto,
            'sku_variante_producto' => 'PROD-COMPAT-L',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);

        // Inventario variante stock 12
        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $variante->cod_variante_producto,
            'stock_actual_inv' => 12,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        // stockActual(null) solo devuelve base (3)
        $this->assertEquals(3, $this->repository->stockActual($producto->cod_producto));

        // stockActual($varianteId) devuelve stock de la variante (12)
        $this->assertEquals(12, $this->repository->stockActual($producto->cod_producto, $variante->cod_variante_producto));
    }

    public function test_prediccion_general_utiliza_stock_total_de_variantes(): void
    {
        // 1. Crear configuración activa
        ConfiguracionInteligenciaVentas::firstOrCreate(['activo' => true]);

        // 2. Crear producto y variantes con stock
        $categoria = $this->crearCategoria();
        $producto = $this->crearProducto($categoria, ['sku_pro' => 'PROD-PRED-TEST', 'nombre_pro' => 'Prod Pred Test']);
        
        // Stock base: 2
        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => null,
            'stock_actual_inv' => 2,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        // Variante S stock: 10
        $varianteS = VarianteProducto::create([
            'cod_producto' => $producto->cod_producto,
            'cod_talla_producto' => $this->tallaS->cod_talla_producto,
            'sku_variante_producto' => 'PROD-PRED-TEST-S',
            'estado_variante_producto' => 'activo',
            'activo_variante_producto' => true,
        ]);

        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => $varianteS->cod_variante_producto,
            'stock_actual_inv' => 10,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        // 3. Crear histórico de ventas
        $canal = $this->crearCanalVenta();
        $flujo = $this->crearTipoFlujo();
        $cliente = $this->crearCliente();

        // 1 pedido de 5 unidades hace 5 días
        $pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
            'cod_usuario_responsable' => $this->admin->id,
            'numero_pedido_ped' => 'PED-PRED-001',
            'fecha_pedido_ped' => now()->subDays(5)->toDateString(),
            'estado_ped' => EstadoPedidoEnum::CONFIRMADO,
            'subtotal_ped' => 500,
            'descuento_ped' => 0,
            'total_ped' => 500,
        ]);

        DetallePedido::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 5,
            'precio_unitario_det' => 100,
            'subtotal_det' => 500,
        ]);

        // 4. Generar predicciones usando el servicio
        $service = app(InteligenciaVentasService::class);
        $service->generar();

        // 5. Verificar que la predicción guardó el stock total del producto (base 2 + variante 10 = 12)
        $prediccion = PrediccionVenta::where('cod_producto', $producto->cod_producto)->firstOrFail();
        
        $this->assertEquals(12, $prediccion->stock_actual);
    }
}
