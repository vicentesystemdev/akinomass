<?php

namespace Database\Seeders\Demo;

use App\Models\CanalVenta;
use App\Models\Cliente;
use App\Models\DetallePedido;
use App\Models\Inventario;
use App\Models\MovimientoInventario;
use App\Models\Pago;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use App\Models\VarianteProducto;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Enums\MetodoPagoEnum;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DemoDefensaVentasHistoricasSeeder extends Seeder
{
    public function run(): void
    {
        $canales = CanalVenta::pluck('cod_canal_venta', 'codigo_can')->toArray();
        $flujos = TipoFlujoComercial::pluck('cod_tipo_flujo_comercial', 'codigo_tip')->toArray();

        $vendedores = User::role('Vendedor')->pluck('id')->toArray();
        $supervisor = User::role('Supervisor Comercial')->first()?->id;
        $adminId = User::role('Administrador')->first()?->id;
        $defaultUser = $vendedores[0] ?? $supervisor ?? $adminId;

        $clientes = Cliente::orderBy('cod_cliente')->get();
        $productos = Producto::with('categoria')->get()->groupBy('categoria.nombre_cat');
        $variantes = VarianteProducto::all()->groupBy('cod_producto');

        $this->command->info('Generando 1000 pedidos históricos realistas...');

        // Mapear los clientes por perfil de comportamiento
        $clientesFrecuentes = $clientes->slice(0, 40)->values();
        $clientesOcasionales = $clientes->slice(40, 95)->values();
        $clientesNuevos = $clientes->slice(135, 50)->values();
        $clientesRiesgo = $clientes->slice(185, 40)->values();

        $pedidosInfo = [];

        // Generar fechas deterministas por perfil
        // A. Frecuentes (12 compras por cliente)
        foreach ($clientesFrecuentes as $idx => $cliente) {
            for ($j = 0; $j < 12; $j++) {
                // Fechas distribuidas desde julio 2025 hasta junio 2026 (con alta recencia en junio)
                $mes = ($j === 11) ? 6 : (($j * 1) + 7);
                $año = ($mes > 12) ? 2026 : 2025;
                $mesReal = ($mes > 12) ? ($mes - 12) : $mes;
                
                $dia = (($idx * 7 + $j * 3) % 27) + 1;
                $fecha = Carbon::create($año, $mesReal, $dia, rand(10, 20), rand(0, 59));
                if ($fecha->isAfter(Carbon::parse('2026-06-19'))) {
                    $fecha = Carbon::parse('2026-06-18 15:30:00');
                }

                $pedidosInfo[] = ['cliente' => $cliente, 'fecha' => $fecha, 'perfil' => 'frecuente'];
            }
        }

        // B. Ocasionales (3 compras por cliente)
        foreach ($clientesOcasionales as $idx => $cliente) {
            for ($j = 0; $j < 3; $j++) {
                $mes = ($j * 4) + 7;
                $año = ($mes > 12) ? 2026 : 2025;
                $mesReal = ($mes > 12) ? ($mes - 12) : $mes;

                $dia = (($idx * 3 + $j * 11) % 27) + 1;
                $fecha = Carbon::create($año, $mesReal, $dia, rand(10, 20), rand(0, 59));
                if ($fecha->isAfter(Carbon::parse('2026-06-19'))) {
                    $fecha = Carbon::parse('2026-06-15 11:20:00');
                }

                $pedidosInfo[] = ['cliente' => $cliente, 'fecha' => $fecha, 'perfil' => 'ocasional'];
            }
        }

        // C. Nuevos (1.5 de promedio -> algunos 1, otros 2 en junio 2026)
        foreach ($clientesNuevos as $idx => $cliente) {
            $compras = ($idx % 2 === 0) ? 2 : 1;
            for ($j = 0; $j < $compras; $j++) {
                $dia = (($idx * 5 + $j * 7) % 14) + 1; // 1 al 14 de junio 2026
                $fecha = Carbon::create(2026, 6, $dia, rand(9, 18), rand(0, 59));

                $pedidosInfo[] = ['cliente' => $cliente, 'fecha' => $fecha, 'perfil' => 'nuevo'];
            }
        }

        // D. En riesgo (4 compras por cliente, compraban antes pero no en los últimos 90-180 días)
        // Rango de compras: Julio 2025 a Febrero 15, 2026 (recencia mínima 125 días)
        foreach ($clientesRiesgo as $idx => $cliente) {
            for ($j = 0; $j < 4; $j++) {
                $mes = ($j * 2) + 7; // Mes 7 (Julio), 9 (Sept), 11 (Nov), 1 (Ene)
                $año = ($mes > 12) ? 2026 : 2025;
                $mesReal = ($mes > 12) ? ($mes - 12) : $mes;

                $dia = (($idx * 11 + $j * 5) % 27) + 1;
                $fecha = Carbon::create($año, $mesReal, $dia, rand(10, 19), rand(0, 59));

                $pedidosInfo[] = ['cliente' => $cliente, 'fecha' => $fecha, 'perfil' => 'riesgo'];
            }
        }

        // Ordenar todos los pedidos por fecha de forma ascendente para mantener consistencia de stocks
        usort($pedidosInfo, fn($a, $b) => $a['fecha']->timestamp <=> $b['fecha']->timestamp);

        $pedidoIndex = 1;

        foreach ($pedidosInfo as $pInfo) {
            $cliente = $pInfo['cliente'];
            $fecha = $pInfo['fecha'];
            $perfil = $pInfo['perfil'];

            // Asignación de canales y estados deterministas
            $randVal = ($pedidoIndex * 13) % 100;
            
            // Estado pedido
            if ($randVal <= 75) {
                $estadoPed = EstadoPedidoEnum::ENTREGADO->value;
                $estadoPag = EstadoPagoEnum::PAGADO->value;
            } elseif ($randVal <= 85) {
                $estadoPed = EstadoPedidoEnum::CONFIRMADO->value;
                $estadoPag = EstadoPagoEnum::PAGADO->value;
            } elseif ($randVal <= 91) {
                $estadoPed = EstadoPedidoEnum::PREPARANDO->value;
                $estadoPag = EstadoPagoEnum::PENDIENTE->value;
            } elseif ($randVal <= 95) {
                $estadoPed = EstadoPedidoEnum::CANCELADO->value;
                $estadoPag = EstadoPagoEnum::RECHAZADO->value;
            } else {
                $estadoPed = EstadoPedidoEnum::BORRADOR->value;
                $estadoPag = EstadoPagoEnum::PENDIENTE->value;
            }

            // Canal y flujo
            if ($randVal <= 45) {
                $canal = 'tiktok_live';
                $flujo = 'venta_en_vivo';
            } elseif ($randVal <= 70) {
                $canal = 'whatsapp';
                $flujo = 'conversacion_directa';
            } elseif ($randVal <= 88) {
                $canal = 'instagram';
                $flujo = 'conversacion_directa';
            } elseif ($randVal <= 96) {
                $canal = 'facebook';
                $flujo = 'conversacion_directa';
            } else {
                $canal = 'web';
                $flujo = 'compra_web';
            }

            // Seleccionar productos basados en la estacionalidad y tendencia deseada
            $itemsCount = (($pedidoIndex * 3) % 2) + 1; // 1 o 2 productos distintos
            $detalles = [];
            $subtotal = 0.0;

            for ($k = 0; $k < $itemsCount; $k++) {
                $catElegida = 'Poleras oversize';
                $mesInt = $fecha->month;
                $progreso = ($fecha->year === 2026 ? 6 : 0) + ($fecha->month - 7); // -5 a 11 aprox
                $randProdVal = ($pedidoIndex * 31 + $k * 17) % 100;

                // Reglas de tendencia y estacionalidad:
                if ($mesInt === 5 || $mesInt === 6 || $mesInt === 7) {
                    // Invierno: Fuerte demanda de chamarras (60% prob)
                    if ($randProdVal < 60) {
                        $catElegida = 'Chamarras';
                    } elseif ($randProdVal < 80) {
                        $catElegida = 'Jeans cargo';
                    } else {
                        $catElegida = 'Poleras oversize';
                    }
                } else {
                    // Otras temporadas
                    // Crecimiento de Jeans cargo con el progreso del tiempo
                    $cargoProb = 5 + ($progreso * 2.5); // de 5% en julio 2025 a 35% en junio 2026
                    // Decrecimiento de Liquidación
                    $liqProb = 25 - ($progreso * 2); // de 25% en julio 2025 a 2% en junio 2026

                    if ($randProdVal < $cargoProb) {
                        $catElegida = 'Jeans cargo';
                    } elseif ($randProdVal < ($cargoProb + $liqProb)) {
                        $catElegida = 'Prendas en liquidación';
                    } elseif ($randProdVal < ($cargoProb + $liqProb + 25)) {
                        $catElegida = 'Poleras oversize';
                    } elseif ($randProdVal < ($cargoProb + $liqProb + 45)) {
                        $catElegida = 'Blusas';
                    } elseif ($randProdVal < ($cargoProb + $liqProb + 65)) {
                        $catElegida = 'Vestidos';
                    } elseif ($randProdVal < ($cargoProb + $liqProb + 85)) {
                        $catElegida = 'Pantalones';
                    } else {
                        $catElegida = 'Accesorios';
                    }
                }

                // Elegir un producto de la categoría
                $catProductos = $productos->get($catElegida);
                if (!$catProductos || $catProductos->isEmpty()) {
                    $catProductos = $productos->get('Poleras oversize');
                }

                $producto = $catProductos->values()->get(($pedidoIndex + $k) % $catProductos->count());
                
                // Elegir una variante
                $prodVariantes = $variantes->get($producto->cod_producto);
                $codVariante = null;
                $precio = $producto->precio_venta_pro;

                if ($prodVariantes && $prodVariantes->isNotEmpty()) {
                    $variante = $prodVariantes->values()->get(($pedidoIndex * 7 + $k) % $prodVariantes->count());
                    $codVariante = $variante->cod_variante_producto;
                    if ($variante->precio_venta_variante) {
                        $precio = $variante->precio_venta_variante;
                    }
                }

                $cantidad = (($pedidoIndex + $k) % 2) + 1; // 1 o 2 unidades

                // Actualizar stock de inventario (descontar) si el pedido no está cancelado
                if ($estadoPed !== EstadoPedidoEnum::CANCELADO->value) {
                    $inventario = Inventario::where('cod_producto', $producto->cod_producto)
                        ->when($codVariante, fn($q) => $q->where('cod_variante_producto', $codVariante), fn($q) => $q->whereNull('cod_variante_producto'))
                        ->first();

                    if ($inventario) {
                        $stockAnterior = $inventario->stock_actual_inv;
                        $stockNuevo = max(0, $stockAnterior - $cantidad);
                        $inventario->stock_actual_inv = $stockNuevo;
                        $inventario->save();

                        // Crear movimiento de salida
                        $mov = MovimientoInventario::create([
                            'cod_inventario' => $inventario->cod_inventario,
                            'cod_producto' => $producto->cod_producto,
                            'tipo_movimiento_mov' => 'salida',
                            'cantidad_mov' => $cantidad,
                            'stock_anterior_mov' => $stockAnterior,
                            'stock_nuevo_mov' => $stockNuevo,
                            'motivo_mov' => "Salida por venta pedido #PED-{$pedidoIndex}",
                            'observacion_mov' => 'Descuento automático por compra.',
                            'cod_usuario_responsable' => $defaultUser,
                        ]);
                        $mov->created_at = $fecha;
                        $mov->save();
                    }
                }

                $detalles[] = [
                    'cod_producto' => $producto->cod_producto,
                    'cod_variante_producto' => $codVariante,
                    'cantidad_det' => $cantidad,
                    'precio_unitario_det' => $precio,
                    'subtotal_det' => $cantidad * $precio,
                ];

                $subtotal += ($cantidad * $precio);
            }

            // Crear pedido
            $descuento = ($subtotal > 150 && $pedidoIndex % 5 === 0) ? 15.0 : 0.0;
            $total = max(10.0, $subtotal - $descuento);

            $pedido = Pedido::create([
                'cod_cliente' => $cliente->cod_cliente,
                'cod_canal_venta' => $canales[$canal] ?? reset($canales),
                'cod_tipo_flujo_comercial' => $flujos[$flujo] ?? reset($flujos),
                'cod_usuario_responsable' => $defaultUser,
                'numero_pedido_ped' => sprintf('PED-%s-%04d', $fecha->format('ymd'), $pedidoIndex),
                'fecha_pedido_ped' => $fecha->toDateString(),
                'estado_ped' => $estadoPed,
                'subtotal_ped' => $subtotal,
                'descuento_ped' => $descuento,
                'total_ped' => $total,
                'observacion_ped' => 'Pedido histórico registrado para simulación comercial.',
            ]);

            $pedido->created_at = $fecha;
            $pedido->updated_at = $fecha;
            $pedido->save();

            // Insertar detalles
            foreach ($detalles as $det) {
                $det['cod_pedido'] = $pedido->cod_pedido;
                $detalle = DetallePedido::create($det);
                $detalle->created_at = $fecha;
                $detalle->save();
            }

            // Crear pago
            $metodos = [MetodoPagoEnum::QR->value, MetodoPagoEnum::TRANSFERENCIA->value, MetodoPagoEnum::EFECTIVO->value];
            $metodo = $metodos[$pedidoIndex % count($metodos)];
            $ref = $metodo === 'efectivo' ? null : ($metodo === 'qr' ? 'QR-' : 'TX-') . rand(100000, 999999);

            $pago = Pago::create([
                'cod_pedido' => $pedido->cod_pedido,
                'cod_usuario_responsable' => $defaultUser,
                'metodo_pago_pag' => $metodo,
                'estado_pago_pag' => $estadoPag,
                'monto_pag' => $total,
                'referencia_pag' => $ref,
                'fecha_pago_pag' => $fecha->toDateString(),
                'observacion_pag' => $estadoPag === EstadoPagoEnum::PAGADO->value ? 'Pago verificado correctamente.' : 'Pago registrado.',
            ]);

            $pago->created_at = $fecha;
            $pago->updated_at = $fecha;
            $pago->save();

            $pedidoIndex++;
        }

        $this->command->info("Se crearon {$pedidoIndex} pedidos históricos exitosamente.");
    }
}
