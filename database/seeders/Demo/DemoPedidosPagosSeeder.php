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
use App\Models\VarianteProducto;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DemoPedidosPagosSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiamos los pedidos y pagos anteriores para asegurar fresh reseed sin duplicados manuales
        Pago::query()->delete();
        DetallePedido::query()->delete();
        Pedido::query()->delete();

        $vendedores = User::whereIn('email', [
            'vendedor@akinomass.local',
            'supervisor@akinomass.local',
            'pedidos@akinomass.local'
        ])->get();
        
        $adminUser = User::where('email', 'admin@akinomass.local')->first();
        $defaultUser = $vendedores->first() ?? $adminUser;

        $clientes = Cliente::all();
        $canales = CanalVenta::all();
        $flujos = TipoFlujoComercial::all();
        $productos = Producto::all();
        $variantes = VarianteProducto::with('talla')->get()->groupBy('cod_producto');

        if ($clientes->isEmpty() || $productos->isEmpty()) {
            $this->command->error('No hay clientes o productos suficientes para generar pedidos.');
            return;
        }

        // Definimos los canales de venta válidos por código
        $canalWhatsApp = $canales->firstWhere('codigo_can', 'whatsapp');
        $canalTikTokLive = $canales->firstWhere('codigo_can', 'tiktok_live');
        $canalInstagram = $canales->firstWhere('codigo_can', 'instagram');
        $canalFacebook = $canales->firstWhere('codigo_can', 'facebook');
        $canalDirecto = $canales->firstWhere('codigo_can', 'venta_directa');
        $canalWeb = $canales->firstWhere('codigo_can', 'web');

        // Flujos correspondientes
        $flujoDirecto = $flujos->firstWhere('codigo_tip', 'conversacion_directa');
        $flujoLive = $flujos->firstWhere('codigo_tip', 'venta_en_vivo');
        $flujoWeb = $flujos->firstWhere('codigo_tip', 'compra_web');
        $flujoVentaDirecta = $flujos->firstWhere('codigo_tip', 'venta_directa');

        // Distribución estacional para los últimos 12 meses
        // Queremos generar pedidos del periodo Junio 2025 a Mayo 2026.
        $meses = [];
        for ($i = 12; $i >= 0; $i--) {
            $meses[] = Carbon::now()->subMonths($i);
        }

        $pedidoIndex = 1;
        $totalPedidosGenerados = 0;

        foreach ($meses as $mes) {
            $numeroMes = $mes->month;
            
            // Cantidad de pedidos según época del año (La Paz, Bolivia)
            // Diciembre (Navidad): Alta rotación, invierno (Junio-Julio): Alta en chamarras y abrigos.
            if ($numeroMes == 12) {
                $cantidadPedidos = rand(15, 22); // Diciembre
            } elseif ($numeroMes == 6 || $numeroMes == 7) {
                $cantidadPedidos = rand(12, 16); // Invierno
            } elseif ($numeroMes == 9 || $numeroMes == 10) {
                $cantidadPedidos = rand(8, 12);  // Primavera
            } else {
                $cantidadPedidos = rand(5, 9);   // Demás meses
            }

            for ($j = 0; $j < $cantidadPedidos; $j++) {
                $fechaPedido = $mes->copy()->day(rand(1, 28))->setTime(rand(9, 21), rand(0, 59));
                $cliente = $clientes->random();
                $vendedor = $vendedores->isEmpty() ? $defaultUser : $vendedores->random();

                // Canal de venta aleatorio con pesos realistas
                $randCanal = rand(1, 100);
                if ($randCanal <= 35) {
                    $canal = $canalWhatsApp;
                    $flujo = $flujoDirecto;
                } elseif ($randCanal <= 60) {
                    $canal = $canalTikTokLive;
                    $flujo = $flujoLive;
                } elseif ($randCanal <= 80) {
                    $canal = $canalInstagram;
                    $flujo = $flujoDirecto;
                } elseif ($randCanal <= 90) {
                    $canal = $canalFacebook;
                    $flujo = $flujoDirecto;
                } elseif ($randCanal <= 96) {
                    $canal = $canalDirecto;
                    $flujo = $flujoVentaDirecta;
                } else {
                    $canal = $canalWeb;
                    $flujo = $flujoWeb;
                }

                // Asegurar que existan canal y flujo
                $canal = $canal ?? $canales->random();
                $flujo = $flujo ?? $flujos->random();

                // Estado del pedido
                $randEstado = rand(1, 100);
                if ($randEstado <= 85) {
                    $estadoPedido = EstadoPedidoEnum::ENTREGADO->value;
                } elseif ($randEstado <= 90) {
                    $estadoPedido = EstadoPedidoEnum::CONFIRMADO->value;
                } elseif ($randEstado <= 95) {
                    $estadoPedido = EstadoPedidoEnum::CANCELADO->value;
                } else {
                    $estadoPedido = EstadoPedidoEnum::PREPARANDO->value;
                }

                // Generar detalles del pedido (1 a 3 productos)
                $cantItems = rand(1, 3);
                $detallesData = [];
                $subtotal = 0;
                
                // Seleccionar productos de forma aleatoria, asegurando no duplicarlos en el mismo pedido
                $productosSeleccionados = $productos->random(min($cantItems, $productos->count()));

                foreach ($productosSeleccionados as $prod) {
                    $cantidad = rand(1, 2);
                    $precioUnitario = $prod->precio_venta_pro;
                    
                    // Si el producto tiene variantes, asignamos una variante aleatoria
                    $varianteId = null;
                    if ($variantes->has($prod->cod_producto)) {
                        $varCollection = $variantes->get($prod->cod_producto);
                        if ($varCollection->isNotEmpty()) {
                            $var = $varCollection->random();
                            $varianteId = $var->cod_variante_producto;
                            if ($var->precio_venta_variante) {
                                $precioUnitario = $var->precio_venta_variante;
                            }
                        }
                    }

                    $detallesData[] = [
                        'cod_producto' => $prod->cod_producto,
                        'cod_variante_producto' => $varianteId,
                        'cantidad' => $cantidad,
                        'precio' => $precioUnitario,
                        'subtotal' => $cantidad * $precioUnitario,
                    ];
                    $subtotal += $cantidad * $precioUnitario;
                }

                // Descuento ocasional
                $descuento = 0;
                if ($subtotal > 150 && rand(1, 10) > 8) {
                    $descuento = rand(5, 20);
                }
                $total = max(10, $subtotal - $descuento);

                $numeroPedido = sprintf('PED-%s-%04d', $fechaPedido->format('ymd'), $pedidoIndex++);
                $pedido = Pedido::create([
                    'numero_pedido_ped' => $numeroPedido,
                    'cod_cliente' => $cliente->cod_cliente,
                    'cod_canal_venta' => $canal->cod_canal_venta,
                    'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
                    'cod_usuario_responsable' => $vendedor?->id,
                    'fecha_pedido_ped' => $fechaPedido->toDateString(),
                    'estado_ped' => $estadoPedido,
                    'subtotal_ped' => $subtotal,
                    'descuento_ped' => $descuento,
                    'total_ped' => $total,
                    'observacion_ped' => $estadoPedido == EstadoPedidoEnum::CANCELADO->value ? 'Cancelado a solicitud del cliente por redes.' : 'Pedido registrado en el Live/Chat.',
                ]);
                
                // Actualizar las fechas de auditoría de creación para que coincidan con la venta histórica
                $pedido->created_at = $fechaPedido;
                $pedido->save();

                foreach ($detallesData as $det) {
                    $detalle = DetallePedido::create([
                        'cod_pedido' => $pedido->cod_pedido,
                        'cod_producto' => $det['cod_producto'],
                        'cod_variante_producto' => $det['cod_variante_producto'],
                        'cantidad_det' => $det['cantidad'],
                        'precio_unitario_det' => $det['precio'],
                        'subtotal_det' => $det['subtotal'],
                    ]);
                    $detalle->created_at = $fechaPedido;
                    $detalle->save();
                }

                // Generar pago asociado
                $metodoPago = MetodoPagoEnum::QR->value;
                $randMetodo = rand(1, 100);
                if ($randMetodo <= 45) {
                    $metodoPago = MetodoPagoEnum::QR->value;
                } elseif ($randMetodo <= 80) {
                    $metodoPago = MetodoPagoEnum::TRANSFERENCIA->value;
                } else {
                    $metodoPago = MetodoPagoEnum::EFECTIVO->value;
                }

                $estadoPago = EstadoPagoEnum::PAGADO->value;
                if ($estadoPedido == EstadoPedidoEnum::CANCELADO->value) {
                    $estadoPago = EstadoPagoEnum::RECHAZADO->value;
                } elseif ($estadoPedido == EstadoPedidoEnum::CONFIRMADO->value) {
                    $estadoPago = rand(1, 10) > 8 ? EstadoPagoEnum::PENDIENTE->value : EstadoPagoEnum::PAGADO->value;
                }

                $referencia = null;
                if ($metodoPago == MetodoPagoEnum::QR->value) {
                    $referencia = 'QR-' . $fechaPedido->format('His') . rand(10, 99);
                } elseif ($metodoPago == MetodoPagoEnum::TRANSFERENCIA->value) {
                    $referencia = 'TRX-' . rand(100000, 999999);
                }

                $pago = Pago::create([
                    'cod_pedido' => $pedido->cod_pedido,
                    'cod_usuario_responsable' => $vendedor?->id,
                    'metodo_pago_pag' => $metodoPago,
                    'estado_pago_pag' => $estadoPago,
                    'monto_pag' => $total,
                    'referencia_pag' => $referencia,
                    'fecha_pago_pag' => $fechaPedido->toDateString(),
                    'observacion_pag' => $estadoPago == EstadoPagoEnum::PAGADO->value ? 'Pago verificado exitosamente.' : 'Pendiente de validación.',
                ]);
                
                $pago->created_at = $fechaPedido;
                $pago->save();

                $totalPedidosGenerados++;
            }
        }

        $this->command->info("Se generaron exitosamente {$totalPedidosGenerados} pedidos históricos realistas.");
    }
}
