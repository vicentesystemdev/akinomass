<?php

namespace Database\Seeders\Demo;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Enums\MetodoPagoEnum;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Models\CanalVenta;
use App\Models\Cliente;
use App\Models\DetallePedido;
use App\Models\Pago;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoPedidosPagosSeeder extends Seeder
{
    public function run(): void
    {
        $vendedor = User::where('email', 'vendedor.demo@akinomass.test')->first();
        $supervisor = User::where('email', 'supervisor.demo@akinomass.test')->first();

        $clientes = Cliente::query()->pluck('cod_cliente', 'correo_cli');
        $canales = CanalVenta::query()->pluck('cod_canal_venta', 'codigo_can');
        $flujos = TipoFlujoComercial::query()->pluck('cod_tipo_flujo_comercial', 'codigo_tip');
        $productos = Producto::query()->pluck('cod_producto', 'sku_pro');

        $pedidosData = [
            ['numero' => 'PED-DEMO-001', 'cliente' => 'maria.lopez.demo@correo.test', 'canal' => 'whatsapp', 'flujo' => 'conversacion_directa', 'estado' => EstadoPedidoEnum::BORRADOR->value, 'usuario' => $vendedor?->id, 'descuento' => 0, 'obs' => 'Pedido en revisión de cantidades.', 'detalles' => [['sku' => 'DEMO-ILU-001', 'cant' => 2, 'precio' => 120], ['sku' => 'DEMO-SOP-002', 'cant' => 1, 'precio' => 80]], 'pago' => ['estado' => EstadoPagoEnum::PENDIENTE->value, 'metodo' => MetodoPagoEnum::TRANSFERENCIA->value, 'monto' => 320, 'referencia' => null, 'obs' => 'Pendiente de confirmación.']],
            ['numero' => 'PED-DEMO-002', 'cliente' => 'carlos.mendoza.demo@correo.test', 'canal' => 'instagram', 'flujo' => 'campania_marketing', 'estado' => EstadoPedidoEnum::CONFIRMADO->value, 'usuario' => $supervisor?->id, 'descuento' => 20, 'obs' => 'Confirmado por campaña mensual.', 'detalles' => [['sku' => 'DEMO-KIT-001', 'cant' => 1, 'precio' => 520], ['sku' => 'DEMO-AUD-001', 'cant' => 1, 'precio' => 330]], 'pago' => ['estado' => EstadoPagoEnum::PAGADO->value, 'metodo' => MetodoPagoEnum::QR->value, 'monto' => 830, 'referencia' => 'QR-DEMO-8302', 'obs' => 'Pago completo validado.']],
            ['numero' => 'PED-DEMO-003', 'cliente' => 'patricia.rojas.demo@correo.test', 'canal' => 'facebook', 'flujo' => 'marketplace', 'estado' => EstadoPedidoEnum::CANCELADO->value, 'usuario' => $supervisor?->id, 'descuento' => 0, 'obs' => 'Cancelado por falta de respuesta del cliente.', 'detalles' => [['sku' => 'DEMO-SOP-001', 'cant' => 1, 'precio' => 190]], 'pago' => ['estado' => EstadoPagoEnum::RECHAZADO->value, 'metodo' => MetodoPagoEnum::DEPOSITO->value, 'monto' => 190, 'referencia' => 'DEP-OBS-003', 'obs' => 'Comprobante ilegible.']],
            ['numero' => 'PED-DEMO-004', 'cliente' => 'diego.quispe.demo@correo.test', 'canal' => 'venta_directa', 'flujo' => 'venta_directa', 'estado' => EstadoPedidoEnum::CONFIRMADO->value, 'usuario' => $vendedor?->id, 'descuento' => 10, 'obs' => 'Retiro en tienda programado.', 'detalles' => [['sku' => 'DEMO-ILU-002', 'cant' => 1, 'precio' => 280], ['sku' => 'DEMO-AUD-002', 'cant' => 1, 'precio' => 260]], 'pago' => ['estado' => EstadoPagoEnum::OBSERVADO->value, 'metodo' => MetodoPagoEnum::TRANSFERENCIA->value, 'monto' => 530, 'referencia' => 'TRX-DEMO-004', 'obs' => 'Transferencia en verificación.']],
            ['numero' => 'PED-DEMO-005', 'cliente' => 'lucia.fernandez.demo@correo.test', 'canal' => 'web', 'flujo' => 'referido', 'estado' => EstadoPedidoEnum::BORRADOR->value, 'usuario' => $vendedor?->id, 'descuento' => 0, 'obs' => 'Cliente pidió confirmar stock antes de cerrar.', 'detalles' => [['sku' => 'DEMO-KIT-002', 'cant' => 1, 'precio' => 890]], 'pago' => ['estado' => EstadoPagoEnum::PENDIENTE->value, 'metodo' => MetodoPagoEnum::OTRO->value, 'monto' => 890, 'referencia' => null, 'obs' => 'Sin pago registrado aún.']],
        ];

        foreach ($pedidosData as $pedidoData) {
            $subtotal = collect($pedidoData['detalles'])->sum(fn (array $detalle) => $detalle['cant'] * $detalle['precio']);
            $total = $subtotal - $pedidoData['descuento'];

            $pedido = Pedido::updateOrCreate(
                ['numero_pedido_ped' => $pedidoData['numero']],
                [
                    'cod_cliente' => $clientes[$pedidoData['cliente']] ?? null,
                    'cod_canal_venta' => $canales[$pedidoData['canal']] ?? null,
                    'cod_tipo_flujo_comercial' => $flujos[$pedidoData['flujo']] ?? null,
                    'cod_usuario_responsable' => $pedidoData['usuario'],
                    'fecha_pedido_ped' => now()->toDateString(),
                    'estado_ped' => $pedidoData['estado'],
                    'subtotal_ped' => $subtotal,
                    'descuento_ped' => $pedidoData['descuento'],
                    'total_ped' => $total,
                    'observacion_ped' => $pedidoData['obs'],
                ],
            );

            DetallePedido::where('cod_pedido', $pedido->cod_pedido)->delete();
            foreach ($pedidoData['detalles'] as $detalleData) {
                DetallePedido::create([
                    'cod_pedido' => $pedido->cod_pedido,
                    'cod_producto' => $productos[$detalleData['sku']] ?? null,
                    'cantidad_det' => $detalleData['cant'],
                    'precio_unitario_det' => $detalleData['precio'],
                    'subtotal_det' => $detalleData['cant'] * $detalleData['precio'],
                ]);
            }

            Pago::updateOrCreate(
                ['cod_pedido' => $pedido->cod_pedido],
                [
                    'cod_usuario_responsable' => $pedidoData['usuario'],
                    'metodo_pago_pag' => $pedidoData['pago']['metodo'],
                    'estado_pago_pag' => $pedidoData['pago']['estado'],
                    'monto_pag' => $pedidoData['pago']['monto'],
                    'referencia_pag' => $pedidoData['pago']['referencia'],
                    'fecha_pago_pag' => now()->toDateString(),
                    'observacion_pag' => $pedidoData['pago']['obs'],
                ],
            );
        }
    }
}
