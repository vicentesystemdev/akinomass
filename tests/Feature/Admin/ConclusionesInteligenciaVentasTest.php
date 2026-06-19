<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Domains\InteligenciaVentas\Actions\ListarConclusionesInteligenciaVentasAction;
use App\Domains\InteligenciaVentas\Services\InteligenciaVentasService;
use App\Models\ConfiguracionInteligenciaVentas;
use App\Models\DetallePedido;
use App\Models\Inventario;
use App\Models\Pedido;
use App\Models\PrediccionVenta;
use App\Models\TallaProducto;
use App\Models\VarianteProducto;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;

final class ConclusionesInteligenciaVentasTest extends AdminTestCase
{
    private TallaProducto $talla;

    protected function setUp(): void
    {
        parent::setUp();
        ConfiguracionInteligenciaVentas::firstOrCreate(['activo' => true]);
        
        $this->talla = TallaProducto::create([
            'codigo_talla_producto' => 'M',
            'nom_talla_producto' => 'Talla M',
            'tipo_talla_producto' => 'letras',
            'activo_talla_producto' => true,
        ]);
    }

    public function test_conclusiones_con_productos_recomendados(): void
    {
        $producto = $this->crearProductoConStockBajo();
        $this->generarPredicciones();

        $action = app(ListarConclusionesInteligenciaVentasAction::class);
        $result = $action->execute();

        $this->assertGreaterThan(0, $result['resumen']['unidades_sugeridas']);
        $this->assertGreaterThan(0, $result['resumen']['inversion_recomendada']);
        $this->assertNotEmpty($result['productos_recomendados']);
        $this->assertStringContainsString('se recomienda priorizar', $result['conclusion_general']);
    }

    public function test_conclusiones_sin_compra_recomendada_con_predicciones(): void
    {
        $producto = $this->crearProductoConStockAlto();
        $this->generarPredicciones();

        $action = app(ListarConclusionesInteligenciaVentasAction::class);
        $result = $action->execute();

        $this->assertEquals(0, $result['resumen']['unidades_sugeridas']);
        $this->assertEquals(0, $result['resumen']['inversion_recomendada']);
        $this->assertEmpty($result['productos_recomendados']);
        
        // Debe contener la conclusión ejecutiva alternativa del Escenario B
        $this->assertStringContainsString('No se recomienda nueva compra inmediata', $result['conclusion_general']);
        $this->assertNotEmpty($result['productos_monitoreo']);
    }

    public function test_conclusiones_sin_predicciones(): void
    {
        PrediccionVenta::query()->delete();

        $action = app(ListarConclusionesInteligenciaVentasAction::class);
        $result = $action->execute();

        $this->assertEquals(0, $result['total_predicciones']);
        $this->assertEquals(0, $result['resumen']['unidades_sugeridas']);
        $this->assertEmpty($result['productos_recomendados']);
        $this->assertEmpty($result['productos_monitoreo']);
    }

    public function test_conclusiones_filtros_todos_se_normalizan(): void
    {
        $this->crearProductoConStockBajo();
        $this->generarPredicciones();

        $action = app(ListarConclusionesInteligenciaVentasAction::class);
        
        // Enviar valores como "todos" o "all"
        $result = $action->execute([
            'cod_categoria_producto' => 'todos',
            'cod_canal_venta' => 'all',
            'nivel_riesgo_stock' => 'todos',
            'nivel_recomendacion' => '',
        ]);

        // Deben normalizarse a null
        $this->assertNull($result['filtros']['cod_categoria_producto']);
        $this->assertNull($result['filtros']['cod_canal_venta']);
        $this->assertNull($result['filtros']['nivel_riesgo_stock']);
        $this->assertNull($result['filtros']['nivel_recomendacion']);

        // No debe vaciar la consulta de predicciones
        $this->assertGreaterThan(0, $result['total_predicciones']);
    }

    private function crearProductoConStockBajo(): \App\Models\Producto
    {
        $categoria = $this->crearCategoria();
        $producto = $this->crearProducto($categoria, ['sku_pro' => 'LOW-STOCK-PROD', 'nombre_pro' => 'Low Stock Prod']);
        
        // Stock 0 para variantes y base
        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => null,
            'stock_actual_inv' => 0,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        $this->crearVentasHistoricas($producto);
        return $producto;
    }

    private function crearProductoConStockAlto(): \App\Models\Producto
    {
        $categoria = $this->crearCategoria();
        $producto = $this->crearProducto($categoria, ['sku_pro' => 'HIGH-STOCK-PROD', 'nombre_pro' => 'High Stock Prod']);
        
        // Stock 500
        Inventario::create([
            'cod_producto' => $producto->cod_producto,
            'cod_variante_producto' => null,
            'stock_actual_inv' => 500,
            'stock_minimo_inv' => 1,
            'activo_inv' => true,
        ]);

        $this->crearVentasHistoricas($producto);
        return $producto;
    }

    private function crearVentasHistoricas(\App\Models\Producto $producto): void
    {
        $canal = $this->crearCanalVenta();
        $flujo = $this->crearTipoFlujo();
        $cliente = $this->crearCliente();

        $pedido = Pedido::create([
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
            'cod_usuario_responsable' => $this->admin->id,
            'numero_pedido_ped' => 'PED-' . $producto->sku_pro,
            'fecha_pedido_ped' => now()->subDays(10)->toDateString(),
            'estado_ped' => EstadoPedidoEnum::CONFIRMADO,
            'subtotal_ped' => 1000,
            'descuento_ped' => 0,
            'total_ped' => 1000,
        ]);

        DetallePedido::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 10,
            'precio_unitario_det' => 100,
            'subtotal_det' => 1000,
        ]);
    }

    private function generarPredicciones(): void
    {
        PrediccionVenta::query()->delete();
        app(InteligenciaVentasService::class)->generar();
    }
}
