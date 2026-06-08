<?php

namespace Tests\Feature\Admin;

use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\InteligenciaVentas\Enums\EstadoDemandaEnum;
use App\Domains\InteligenciaVentas\Actions\ListarConclusionesInteligenciaVentasAction;
use App\Domains\InteligenciaVentas\Services\ClasificadorDemandaRelativaService;
use App\Domains\InteligenciaVentas\Services\MatrizTransicionDemandaService;
use App\Models\ConfiguracionInteligenciaVentas;
use App\Models\DetallePedido;
use App\Models\Pedido;
use App\Models\PrediccionVenta;
use App\Models\Producto;
use Inertia\Testing\AssertableInertia as Assert;

class InteligenciaVentasTest extends AdminTestCase
{
    public function test_acceder_a_inteligencia_ventas_requiere_autenticacion(): void
    {
        $this->get(route('inteligencia-ventas.index'))->assertRedirect('/login');
    }

    public function test_generar_prediccion_con_datos_existentes(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);

        $this->post(route('inteligencia-ventas.generar'))->assertRedirect(route('inteligencia-ventas.index'));

        $this->assertGreaterThanOrEqual(3, PrediccionVenta::count());
    }

    public function test_clasifica_demanda_baja_media_y_alta_usando_indice_relativo(): void
    {
        $config = ConfiguracionInteligenciaVentas::create(['activo' => true]);
        $service = app(ClasificadorDemandaRelativaService::class);

        $this->assertEquals(EstadoDemandaEnum::BAJA, $service->clasificar(0.50, $config));
        $this->assertEquals(EstadoDemandaEnum::MEDIA, $service->clasificar(1.00, $config));
        $this->assertEquals(EstadoDemandaEnum::ALTA, $service->clasificar(1.50, $config));
    }

    public function test_calcula_matriz_de_transicion_de_demanda(): void
    {
        $resultado = app(MatrizTransicionDemandaService::class)->calcular([
            EstadoDemandaEnum::BAJA,
            EstadoDemandaEnum::MEDIA,
            EstadoDemandaEnum::ALTA,
            EstadoDemandaEnum::ALTA,
        ], EstadoDemandaEnum::ALTA);

        $this->assertEquals(1.0, $resultado->matriz['baja']['media']);
        $this->assertEquals(1.0, $resultado->matriz['media']['alta']);
        $this->assertEquals('alta', $resultado->estadoPredicho);
    }

    public function test_calcula_metricas_numericas_obligatorias(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $prediccion = PrediccionVenta::whereHas('producto', fn ($query) => $query->where('sku_pro', 'IV-TEST-ALTA'))->firstOrFail();

        $this->assertGreaterThan(0, $prediccion->ventas_estimadas_proximo_periodo);
        $this->assertGreaterThan(0, $prediccion->rango_estimado_minimo);
        $this->assertGreaterThanOrEqual($prediccion->rango_estimado_minimo, $prediccion->rango_estimado_maximo);
        $this->assertGreaterThan(0, $prediccion->stock_seguridad_dinamico);
        $this->assertGreaterThan(0, $prediccion->cantidad_sugerida_abastecimiento);
        $this->assertGreaterThan(0, (float) $prediccion->rotacion_stock);
        $this->assertGreaterThanOrEqual(0, (float) $prediccion->ratio_cobertura);
        $this->assertGreaterThan(0, (float) $prediccion->ingreso_estimado);
    }

    public function test_recomienda_abastecimiento_alto_para_demanda_alta_y_bajo_stock(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $prediccion = PrediccionVenta::whereHas('producto', fn ($query) => $query->where('sku_pro', 'IV-TEST-ALTA'))->firstOrFail();

        $this->assertEquals('alta', $prediccion->estado_demanda_predicho->value);
        $this->assertEquals('alto', $prediccion->nivel_riesgo_stock->value);
        $this->assertEquals('alta', $prediccion->nivel_recomendacion->value);
    }

    public function test_recomienda_no_abastecer_para_baja_demanda_con_stock_suficiente(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $prediccion = PrediccionVenta::whereHas('producto', fn ($query) => $query->where('sku_pro', 'IV-TEST-BAJA'))->firstOrFail();

        $this->assertEquals(0, $prediccion->cantidad_sugerida_abastecimiento);
        $this->assertEquals('no_abastecer', $prediccion->nivel_recomendacion->value);
    }

    public function test_verifica_analisis_por_categoria_y_canal(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $this->get(route('inteligencia-ventas.categorias'))->assertOk();
        $this->get(route('inteligencia-ventas.canales'))->assertOk();
        $this->assertNotNull(PrediccionVenta::whereNotNull('canal_dominante')->first());
    }

    public function test_limpiar_predicciones_no_borra_ventas_productos_ni_inventario(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $productos = Producto::count();
        $pedidos = Pedido::count();

        $this->delete(route('inteligencia-ventas.limpiar'))->assertRedirect(route('inteligencia-ventas.index'));

        $this->assertDatabaseCount('predicciones_ventas', 0);
        $this->assertEquals($productos, Producto::count());
        $this->assertEquals($pedidos, Pedido::count());
    }

    public function test_no_modifica_checkout_publico_y_rutas_inertia_cargan(): void
    {
        $this->postJson('/tienda/checkout', ['cod_carrito' => 999])->assertStatus(401);

        $this->actingAs($this->admin);
        $this->get(route('inteligencia-ventas.index'))->assertOk();
        $this->get(route('inteligencia-ventas.productos'))->assertOk();
        $this->get(route('inteligencia-ventas.abastecimiento'))->assertOk();
        $this->get(route('inteligencia-ventas.conclusiones'))->assertOk();
        $this->get(route('inteligencia-ventas.configuracion'))->assertOk();
    }

    public function test_conclusiones_cargan_con_datos_ejecutivos_y_escenarios(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $this->get(route('inteligencia-ventas.conclusiones'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('InteligenciaVentas/Conclusiones')
                ->has('conclusiones.resumen')
                ->has('conclusiones.conclusion_general')
                ->has('conclusiones.productos_recomendados')
                ->has('conclusiones.categorias_recomendadas')
                ->has('conclusiones.no_abastecer')
                ->has('conclusiones.escenarios', 3)
                ->where('conclusiones.escenarios.0.clave', 'conservador')
                ->where('conclusiones.escenarios.1.clave', 'recomendado')
                ->where('conclusiones.escenarios.2.clave', 'agresivo')
            );
    }

    public function test_conclusiones_pueden_filtrarse_por_horizonte_de_meses(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $this->get(route('inteligencia-ventas.conclusiones', [
            'tipo_analisis' => 'meses',
            'horizonte_meses' => 3,
        ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('conclusiones.filtros.tipo_analisis', 'meses')
                ->where('conclusiones.filtros.horizonte_meses', 3)
                ->has('conclusiones.escenarios', 3)
            );
    }

    public function test_conclusiones_pueden_filtrarse_por_temporada(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $this->get(route('inteligencia-ventas.conclusiones', [
            'tipo_analisis' => 'temporada',
            'temporada' => 'verano',
        ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('conclusiones.filtros.tipo_analisis', 'temporada')
                ->where('conclusiones.filtros.temporada', 'verano')
                ->has('conclusiones.temporada')
                ->has('conclusiones.escenarios', 3)
            );
    }

    public function test_escenarios_de_conclusiones_calculan_inversion_ingreso_ganancia_roi_y_riesgo(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $this->get(route('inteligencia-ventas.conclusiones'))->assertOk();
        $escenarios = app(ListarConclusionesInteligenciaVentasAction::class)->execute()['escenarios'];

        $this->assertCount(3, $escenarios);
        foreach ($escenarios as $escenario) {
            $this->assertArrayHasKey('costo_inversion', $escenario);
            $this->assertArrayHasKey('ingreso_estimado', $escenario);
            $this->assertArrayHasKey('ganancia_estimada', $escenario);
            $this->assertArrayHasKey('roi_estimado', $escenario);
            $this->assertArrayHasKey('riesgo', $escenario);
        }

        $recomendado = collect($escenarios)->firstWhere('clave', 'recomendado');
        $this->assertGreaterThan(0, $recomendado['unidades_sugeridas']);
        $this->assertGreaterThan(0, $recomendado['costo_inversion']);
        $this->assertGreaterThan(0, $recomendado['ingreso_estimado']);
        $this->assertGreaterThanOrEqual(0, $recomendado['ganancia_estimada']);
    }

    public function test_conclusiones_usan_predicciones_existentes_y_no_modifican_datos_operativos(): void
    {
        $this->crearEscenarioHistorico();
        $this->actingAs($this->admin);
        $this->post(route('inteligencia-ventas.generar'));

        $productos = Producto::count();
        $pedidos = Pedido::count();
        $predicciones = PrediccionVenta::count();

        $this->get(route('inteligencia-ventas.conclusiones'))->assertOk();

        $this->assertEquals($productos, Producto::count());
        $this->assertEquals($pedidos, Pedido::count());
        $this->assertEquals($predicciones, PrediccionVenta::count());
    }

    private function crearEscenarioHistorico(): void
    {
        ConfiguracionInteligenciaVentas::firstOrCreate(['activo' => true]);

        $categoria = $this->crearCategoria(['nombre_cat' => 'IV Test Categoria']);
        $canalWhatsapp = $this->crearCanalVenta(['codigo_can' => 'iv_test_whatsapp', 'nombre_can' => 'IV Test WhatsApp']);
        $canalInstagram = $this->crearCanalVenta(['codigo_can' => 'iv_test_instagram', 'nombre_can' => 'IV Test Instagram']);
        $flujo = $this->crearTipoFlujo(['codigo_tip' => 'iv_test_flujo', 'nombre_tip' => 'IV Test Flujo']);
        $cliente = $this->crearCliente(['correo_cli' => 'iv-test-cliente@test.com']);

        $alta = $this->crearProducto($categoria, ['sku_pro' => 'IV-TEST-ALTA', 'nombre_pro' => 'IV Test Producto Alta', 'precio_venta_pro' => 100]);
        $media = $this->crearProducto($categoria, ['sku_pro' => 'IV-TEST-MEDIA', 'nombre_pro' => 'IV Test Producto Media', 'precio_venta_pro' => 80]);
        $baja = $this->crearProducto($categoria, ['sku_pro' => 'IV-TEST-BAJA', 'nombre_pro' => 'IV Test Producto Baja', 'precio_venta_pro' => 120]);

        $this->crearInventario($alta, 1);
        $this->crearInventario($media, 10);
        $this->crearInventario($baja, 40);

        foreach ([90 => 5, 60 => 12, 30 => 22, 5 => 30] as $dias => $cantidad) {
            $this->crearPedidoHistorico($alta, $cliente->cod_cliente, $canalWhatsapp->cod_canal_venta, $flujo->cod_tipo_flujo_comercial, $cantidad, now()->subDays($dias)->toDateString(), 100);
        }

        foreach ([90 => 10, 60 => 10, 30 => 10, 5 => 10] as $dias => $cantidad) {
            $this->crearPedidoHistorico($media, $cliente->cod_cliente, $canalInstagram->cod_canal_venta, $flujo->cod_tipo_flujo_comercial, $cantidad, now()->subDays($dias)->toDateString(), 80);
        }

        foreach ([90 => 6, 60 => 4, 30 => 2, 5 => 1] as $dias => $cantidad) {
            $this->crearPedidoHistorico($baja, $cliente->cod_cliente, $canalInstagram->cod_canal_venta, $flujo->cod_tipo_flujo_comercial, $cantidad, now()->subDays($dias)->toDateString(), 120);
        }
    }

    private function crearPedidoHistorico(Producto $producto, int $cliente, int $canal, int $flujo, int $cantidad, string $fecha, float $precio): void
    {
        $pedido = Pedido::create([
            'cod_cliente' => $cliente,
            'cod_canal_venta' => $canal,
            'cod_tipo_flujo_comercial' => $flujo,
            'cod_usuario_responsable' => $this->admin->id,
            'numero_pedido_ped' => 'IVT-'.$producto->sku_pro.'-'.$fecha.'-'.$cantidad,
            'fecha_pedido_ped' => $fecha,
            'estado_ped' => EstadoPedidoEnum::CONFIRMADO,
            'subtotal_ped' => $cantidad * $precio,
            'descuento_ped' => 0,
            'total_ped' => $cantidad * $precio,
        ]);

        DetallePedido::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => $cantidad,
            'precio_unitario_det' => $precio,
            'subtotal_det' => $cantidad * $precio,
        ]);
    }
}
