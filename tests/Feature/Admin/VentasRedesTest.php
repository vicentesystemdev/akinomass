<?php

namespace Tests\Feature\Admin;

use App\Domains\CRM\Leads\Enums\EstadoLeadEnum;
use App\Domains\VentasRedes\Enums\EstadoVentaRedEnum;
use App\Models\Lead;
use App\Models\Pedido;
use App\Models\VentaRed;

class VentasRedesTest extends AdminTestCase
{
    public function test_crear_venta_por_redes_asociada_a_lead(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $lead = $this->crearLead();

        $this->actingAs($this->admin);

        $response = $this->post(route('ventas-redes.store'), [
            'cod_lead' => $lead->cod_lead,
            'cod_canal_venta' => $lead->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $lead->cod_tipo_flujo_comercial,
            'estado_venta_red' => EstadoVentaRedEnum::PENDIENTE_CONFIRMACION->value,
            'tipo_interaccion' => 'whatsapp',
            'descuento' => 10,
            'detalles' => [
                [
                    'cod_producto' => $producto->cod_producto,
                    'cantidad' => 2,
                    'precio_unitario' => 100,
                ],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('ventas_redes', [
            'cod_lead' => $lead->cod_lead,
            'subtotal' => 200,
            'descuento' => 10,
            'total' => 190,
        ]);
    }

    public function test_crear_venta_por_redes_asociada_a_cliente_no_crea_cliente_paralelo(): void
    {
        $cliente = $this->crearCliente();

        $this->actingAs($this->admin);

        $this->post(route('ventas-redes.store'), [
            'cod_cliente' => $cliente->cod_cliente,
            'cod_canal_venta' => $cliente->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $cliente->cod_tipo_flujo_comercial,
            'estado_venta_red' => EstadoVentaRedEnum::BORRADOR->value,
            'tipo_interaccion' => 'mensaje_privado',
        ]);

        $this->assertDatabaseCount('clientes', 1);
        $this->assertDatabaseHas('ventas_redes', ['cod_cliente' => $cliente->cod_cliente]);
    }

    public function test_agregar_producto_existente_recalcula_totales(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $venta = $this->crearVentaRed();

        $this->actingAs($this->admin);

        $this->post(route('ventas-redes.detalles.store', $venta), [
            'cod_producto' => $producto->cod_producto,
            'cantidad' => 3,
            'precio_unitario' => 80,
        ])->assertRedirect();

        $venta->refresh();
        $this->assertEquals(240.00, (float) $venta->subtotal);
        $this->assertEquals(240.00, (float) $venta->total);
    }

    public function test_cambiar_estado_y_confirmar_venta_por_redes(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $venta = $this->crearVentaRed();
        $venta->detalles()->create([
            'cod_producto' => $producto->cod_producto,
            'cantidad' => 1,
            'precio_unitario' => 100,
            'subtotal' => 100,
        ]);

        $this->actingAs($this->admin);

        $this->patch(route('ventas-redes.estado', $venta), [
            'estado_venta_red' => EstadoVentaRedEnum::PENDIENTE_CONFIRMACION->value,
        ])->assertRedirect();

        $this->post(route('ventas-redes.confirmar', $venta))->assertRedirect();

        $venta->refresh();
        $this->assertEquals(EstadoVentaRedEnum::CONFIRMADA->value, $venta->estado_venta_red->value);
        $this->assertNotNull($venta->fecha_confirmacion);
    }

    public function test_convertir_lead_asociado_a_cliente_reutiliza_flujo_existente(): void
    {
        $lead = $this->crearLead();
        $venta = $this->crearVentaRed(['cod_lead' => $lead->cod_lead, 'cod_cliente' => null]);

        $this->actingAs($this->admin);

        $this->post(route('ventas-redes.convertir-lead-cliente', $venta))->assertRedirect();

        $lead->refresh();
        $venta->refresh();
        $this->assertEquals(EstadoLeadEnum::CONVERTIDO->value, $lead->estado_lea);
        $this->assertNotNull($lead->cod_cliente);
        $this->assertEquals($lead->cod_cliente, $venta->cod_cliente);
    }

    public function test_convertir_venta_por_redes_a_pedido(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $cliente = $this->crearCliente();
        $venta = $this->crearVentaRed(['cod_cliente' => $cliente->cod_cliente]);
        $venta->detalles()->create([
            'cod_producto' => $producto->cod_producto,
            'cantidad' => 2,
            'precio_unitario' => 100,
            'subtotal' => 200,
        ]);
        $venta->update(['subtotal' => 200, 'total' => 200]);

        $this->actingAs($this->admin);

        $this->post(route('ventas-redes.convertir-pedido', $venta))->assertRedirect();

        $venta->refresh();
        $this->assertEquals(EstadoVentaRedEnum::CONVERTIDA_PEDIDO->value, $venta->estado_venta_red->value);
        $this->assertNotNull($venta->cod_pedido);
        $this->assertDatabaseHas('detalles_pedido', [
            'cod_pedido' => $venta->cod_pedido,
            'cod_producto' => $producto->cod_producto,
            'cantidad_det' => 2,
        ]);
    }

    public function test_no_puede_convertir_venta_sin_detalles(): void
    {
        $venta = $this->crearVentaRed(['cod_cliente' => $this->crearCliente()->cod_cliente]);

        $this->actingAs($this->admin);

        $this->post(route('ventas-redes.convertir-pedido', $venta))
            ->assertSessionHasErrors('detalles');

        $this->assertDatabaseCount('pedidos', 0);
    }

    public function test_no_puede_convertir_venta_cancelada(): void
    {
        [$producto] = $this->crearProductoConStock(10);
        $venta = $this->crearVentaRed([
            'cod_cliente' => $this->crearCliente()->cod_cliente,
            'estado_venta_red' => EstadoVentaRedEnum::CANCELADA,
        ]);
        $venta->detalles()->create([
            'cod_producto' => $producto->cod_producto,
            'cantidad' => 1,
            'precio_unitario' => 100,
            'subtotal' => 100,
        ]);

        $this->actingAs($this->admin);

        $this->post(route('ventas-redes.convertir-pedido', $venta));

        $this->assertDatabaseCount('pedidos', 0);
    }

    public function test_tienda_publica_sigue_disponible(): void
    {
        $this->get('/tienda')->assertOk();
    }

    private function crearLead(array $attributes = []): Lead
    {
        $canal = $this->crearCanalVenta(['codigo_can' => 'whatsapp', 'nombre_can' => 'WhatsApp']);
        $flujo = $this->crearTipoFlujo(['codigo_tip' => 'redes_sociales', 'nombre_tip' => 'Redes Sociales']);

        return Lead::create(array_merge([
            'nombre_lea' => 'Lead Test',
            'telefono_lea' => '70000000',
            'correo_lea' => 'lead@test.com',
            'estado_lea' => EstadoLeadEnum::INTERESADO->value,
            'cod_canal_venta' => $canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
            'cod_usuario_responsable' => $this->admin->id,
        ], $attributes));
    }

    private function crearVentaRed(array $attributes = []): VentaRed
    {
        $lead = $attributes['cod_lead'] ?? null ? null : $this->crearLead();
        $canal = $this->crearCanalVenta(['codigo_can' => 'whatsapp', 'nombre_can' => 'WhatsApp']);
        $flujo = $this->crearTipoFlujo(['codigo_tip' => 'redes_sociales', 'nombre_tip' => 'Redes Sociales']);

        return VentaRed::create(array_merge([
            'codigo_venta_red' => 'VR-TEST-'.str_pad((string) (VentaRed::count() + 1), 3, '0', STR_PAD_LEFT),
            'cod_lead' => $lead?->cod_lead,
            'cod_cliente' => null,
            'cod_canal_venta' => $canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
            'cod_usuario_responsable' => $this->admin->id,
            'estado_venta_red' => EstadoVentaRedEnum::BORRADOR,
            'tipo_interaccion' => 'whatsapp',
            'subtotal' => 0,
            'descuento' => 0,
            'total' => 0,
        ], $attributes));
    }
}
