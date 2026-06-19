<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Enums\MetodoPagoEnum;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Models\DetallePedido;
use App\Models\Pago;
use App\Models\Pedido;
use App\Models\Producto;
use Inertia\Testing\AssertableInertia as Assert;

final class InteligenciaVentasMachineLearningTest extends AdminTestCase
{
    public function test_rutas_de_machine_learning_requieren_autenticacion(): void
    {
        $this->get(route('inteligencia-ventas.segmentacion-clientes'))->assertRedirect('/login');
        $this->get(route('inteligencia-ventas.tendencias-regresion'))->assertRedirect('/login');
    }

    public function test_segmentacion_genera_tres_clusters_con_datos_suficientes(): void
    {
        [$producto, $canal, $flujo] = $this->escenarioBase();

        foreach (range(1, 6) as $indice) {
            $cliente = $this->crearCliente([
                'nombre_cli' => "Cliente ML {$indice}",
                'correo_cli' => "cliente-ml-{$indice}@test.com",
            ]);
            $pedidos = $indice <= 2 ? 6 : ($indice <= 4 ? 3 : 1);
            $precio = $indice <= 2 ? 450 : ($indice <= 4 ? 220 : 80);

            foreach (range(1, $pedidos) as $numero) {
                $this->crearVentaPagada(
                    $producto,
                    $cliente->cod_cliente,
                    $canal,
                    $flujo,
                    $numero,
                    $precio,
                    now()->subDays(($indice * 18) + $numero)->toDateString(),
                );
            }
        }

        $this->actingAs($this->admin)
            ->get(route('inteligencia-ventas.segmentacion-clientes', ['clusters' => 3]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('InteligenciaVentas/SegmentacionClientes')
                ->where('segmentacion.suficientes_datos', true)
                ->has('segmentacion.resumen_clusters', 3)
                ->has('segmentacion.clientes', 6)
            );
    }

    public function test_segmentacion_muestra_mensaje_sin_datos_suficientes(): void
    {
        $this->actingAs($this->admin)
            ->get(route('inteligencia-ventas.segmentacion-clientes'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('segmentacion.suficientes_datos', false)
                ->where(
                    'segmentacion.mensaje',
                    'No existen datos históricos suficientes para generar una segmentación confiable.',
                )
            );
    }

    public function test_regresion_proyecta_serie_historica_ascendente(): void
    {
        [$producto, $canal, $flujo] = $this->escenarioBase();
        $cliente = $this->crearCliente([
            'nombre_cli' => 'Cliente Tendencia',
            'correo_cli' => 'cliente-tendencia@test.com',
        ]);

        foreach ([4 => 1, 3 => 2, 2 => 3, 1 => 4, 0 => 5] as $meses => $cantidad) {
            $this->crearVentaPagada(
                $producto,
                $cliente->cod_cliente,
                $canal,
                $flujo,
                $cantidad,
                100,
                now()->subMonths($meses)->startOfMonth()->addDays(4)->toDateString(),
            );
        }

        $this->actingAs($this->admin)
            ->get(route('inteligencia-ventas.tendencias-regresion', [
                'periodicidad' => 'mensual',
                'metrica' => 'cantidad',
                'periodo_inicio' => now()->subMonths(4)->startOfMonth()->toDateString(),
                'periodo_fin' => now()->endOfMonth()->toDateString(),
                'cod_producto' => $producto->cod_producto,
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('InteligenciaVentas/TendenciasRegresion')
                ->where('tendencia.suficientes_datos', true)
                ->where('tendencia.direccion_tendencia', 'Creciente')
                ->has('tendencia.resultados', 5)
            );
    }

    private function escenarioBase(): array
    {
        $categoria = $this->crearCategoria(['nombre_cat' => 'Machine Learning']);
        $producto = $this->crearProducto($categoria, [
            'nombre_pro' => 'Producto ML',
            'sku_pro' => 'ML-001',
        ]);
        $canal = $this->crearCanalVenta([
            'codigo_can' => 'ml_canal',
            'nombre_can' => 'Canal ML',
        ]);
        $flujo = $this->crearTipoFlujo([
            'codigo_tip' => 'ml_flujo',
            'nombre_tip' => 'Flujo ML',
        ]);

        return [$producto, $canal->cod_canal_venta, $flujo->cod_tipo_flujo_comercial];
    }

    private function crearVentaPagada(
        Producto $producto,
        int $cliente,
        int $canal,
        int $flujo,
        int $cantidad,
        float $precio,
        string $fecha,
    ): void {
        $pedido = Pedido::create([
            'cod_cliente' => $cliente,
            'cod_canal_venta' => $canal,
            'cod_tipo_flujo_comercial' => $flujo,
            'cod_usuario_responsable' => $this->admin->id,
            'numero_pedido_ped' => 'ML-'.uniqid(),
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

        Pago::create([
            'cod_pedido' => $pedido->cod_pedido,
            'cod_usuario_responsable' => $this->admin->id,
            'metodo_pago_pag' => MetodoPagoEnum::QR,
            'estado_pago_pag' => EstadoPagoEnum::PAGADO,
            'monto_pag' => $cantidad * $precio,
            'fecha_pago_pag' => $fecha,
        ]);
    }
}
