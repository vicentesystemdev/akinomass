<?php

namespace Database\Seeders\Demo;

use App\Models\CanalVenta;
use App\Models\CheckoutSesion;
use App\Models\Cliente;
use App\Models\ComprobantePagoTienda;
use App\Models\CuentaCliente;
use App\Models\DetalleFactura;
use App\Models\DetallePedido;
use App\Models\DireccionCliente;
use App\Models\Factura;
use App\Models\Pago;
use App\Models\PagoTienda;
use App\Models\Pedido;
use App\Models\PedidoTienda;
use App\Models\Producto;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use App\Models\VarianteProducto;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Enums\MetodoPagoEnum;
use App\Domains\Tienda\Facturacion\Enums\EstadoFacturaEnum;
use App\Domains\Tienda\Facturacion\Enums\TipoComprobanteEnum;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DemoDefensaTiendaOnlineSeeder extends Seeder
{
    public function run(): void
    {
        $canalWeb = CanalVenta::where('codigo_can', 'web')->value('cod_canal_venta');
        $flujoWeb = TipoFlujoComercial::where('codigo_tip', 'compra_web')->value('cod_tipo_flujo_comercial');

        $adminId = User::role('Administrador')->first()?->id ?? 1;

        // Clientes para la tienda online (tomados de la lista de clientes sembrados)
        // Tomaremos desde el cliente 100 en adelante
        $clientes = Cliente::orderBy('cod_cliente')->skip(100)->take(120)->get();
        $productos = Producto::all();
        $variantes = VarianteProducto::all()->groupBy('cod_producto');

        $this->command->info('Generando 150 pedidos web de tienda online y facturación...');

        for ($i = 1; $i <= 150; $i++) {
            $cliente = $clientes->values()->get($i % $clientes->count());
            
            // 1. Asegurar Cuenta y Dirección
            $user = User::where('email', $cliente->correo_cli)->first();
            if (!$user) {
                // Crear usuario cliente correspondiente
                $user = User::create([
                    'name' => $cliente->nombre_cli,
                    'email' => $cliente->correo_cli,
                    'password' => bcrypt('password'),
                ]);
                $user->syncRoles(['Cliente']);
            }

            $cuenta = CuentaCliente::where('cod_cliente', $cliente->cod_cliente)->first();
            if (!$cuenta) {
                $cuenta = CuentaCliente::create([
                    'user_id' => $user->id,
                    'cod_cliente' => $cliente->cod_cliente,
                    'estado_cue' => 'activa',
                    'fecha_activacion_cue' => Carbon::now()->subMonths(1),
                ]);
            }

            $direccion = DireccionCliente::where('cod_cliente', $cliente->cod_cliente)->first();
            if (!$direccion) {
                $direccion = DireccionCliente::create([
                    'cod_cliente' => $cliente->cod_cliente,
                    'etiqueta_dir' => 'Domicilio',
                    'nombre_destinatario_dir' => $cliente->nombre_cli,
                    'telefono_dir' => $cliente->telefono_cli ?? '71234567',
                    'direccion_dir' => $cliente->direccion_cli ?? 'Zona central de La Paz',
                    'es_predeterminada_dir' => true,
                    'activo_dir' => true,
                ]);
            }

            // Fecha determinista
            $fecha = Carbon::parse('2025-07-10')->addDays($i * 2)->setTime(14, rand(0, 59));
            if ($fecha->isAfter(Carbon::parse('2026-06-19'))) {
                $fecha = Carbon::parse('2026-06-18 10:15:00');
            }

            // Determinar estados del flujo web
            $randVal = ($i * 19) % 100;
            if ($randVal <= 80) {
                $estadoPte = 'aceptado';
                $estadoPed = EstadoPedidoEnum::ENTREGADO->value;
                $estadoPag = EstadoPagoEnum::PAGADO->value;
            } elseif ($randVal <= 93) {
                $estadoPte = 'pendiente_revision';
                $estadoPed = EstadoPedidoEnum::CONFIRMADO->value;
                $estadoPag = EstadoPagoEnum::PENDIENTE->value;
            } else {
                $estadoPte = 'rechazado';
                $estadoPed = EstadoPedidoEnum::CANCELADO->value;
                $estadoPag = EstadoPagoEnum::RECHAZADO->value;
            }

            // Items a comprar
            $itemsCount = ($i % 2) + 1;
            $detalles = [];
            $subtotal = 0.0;

            for ($j = 0; $j < $itemsCount; $j++) {
                $producto = $productos->get(($i * 3 + $j) % $productos->count());
                $prodVariantes = $variantes->get($producto->cod_producto);
                $codVariante = null;
                $precio = $producto->precio_venta_pro;

                if ($prodVariantes && $prodVariantes->isNotEmpty()) {
                    $variante = $prodVariantes->values()->get(($i * 11 + $j) % $prodVariantes->count());
                    $codVariante = $variante->cod_variante_producto;
                    if ($variante->precio_venta_variante) {
                        $precio = $variante->precio_venta_variante;
                    }
                }

                $cantidad = 1;

                $detalles[] = [
                    'cod_producto' => $producto->cod_producto,
                    'cod_variante_producto' => $codVariante,
                    'cantidad_det' => $cantidad,
                    'precio_unitario_det' => $precio,
                    'subtotal_det' => $precio,
                ];

                $subtotal += $precio;
            }

            $total = $subtotal;

            // 2. Crear CheckoutSesion
            $checkout = CheckoutSesion::create([
                'cod_cuenta_cliente' => $cuenta->cod_cuenta_cliente,
                'cod_carrito' => null,
                'cod_direccion_cliente' => $direccion->cod_direccion_cliente,
                'estado_che' => 'completado',
                'email_contacto_che' => $cliente->correo_cli,
                'telefono_contacto_che' => $cliente->telefono_cli ?? '71234567',
                'direccion_entrega_che' => $direccion->direccion_dir,
                'documento_facturacion_che' => $cliente->documento_cli ?? '1234567',
                'razon_social_che' => $cliente->nombre_cli,
                'subtotal_che' => $subtotal,
                'descuento_che' => 0.00,
                'total_che' => $total,
                'metodo_pago_elegido_che' => MetodoPagoEnum::QR->value,
                'referencia_pago_che' => 'QR-WEB-' . rand(100000, 999999),
                'comprobante_ruta_che' => 'demo/comprobantes/placeholder.png',
                'token_che' => (string) Str::uuid(),
                'expira_en_che' => $fecha->copy()->addHour(),
                'completado_en_che' => $fecha,
            ]);
            $checkout->created_at = $fecha;
            $checkout->save();

            // 3. Crear Pedido Base
            $pedido = Pedido::create([
                'cod_cliente' => $cliente->cod_cliente,
                'cod_canal_venta' => $canalWeb,
                'cod_tipo_flujo_comercial' => $flujoWeb,
                'cod_usuario_responsable' => null,
                'numero_pedido_ped' => sprintf('PED-WEB-%05d', $i),
                'fecha_pedido_ped' => $fecha->toDateString(),
                'estado_ped' => $estadoPed,
                'subtotal_ped' => $subtotal,
                'descuento_ped' => 0.00,
                'total_ped' => $total,
                'observacion_ped' => 'Pedido generado desde la Tienda Online B2C.',
            ]);
            $pedido->created_at = $fecha;
            $pedido->save();

            // 4. Crear PedidoTienda
            PedidoTienda::create([
                'cod_pedido' => $pedido->cod_pedido,
                'cod_checkout_sesion' => $checkout->cod_checkout_sesion,
                'user_id' => $user->id,
                'cod_cuenta_cliente' => $cuenta->cod_cuenta_cliente,
                'session_id_pte' => session_id() ?: Str::random(40),
                'ip_origen_pte' => '127.0.0.1',
                'user_agent_pte' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'estado_pte' => $estadoPte,
            ]);

            // 5. Insertar Detalles de Pedido
            $detallesCreados = [];
            foreach ($detalles as $det) {
                $det['cod_pedido'] = $pedido->cod_pedido;
                $detalle = DetallePedido::create($det);
                $detalle->created_at = $fecha;
                $detalle->save();
                $detallesCreados[] = $detalle;
            }

            // 6. Crear Pago Base
            $pago = Pago::create([
                'cod_pedido' => $pedido->cod_pedido,
                'cod_usuario_responsable' => $adminId,
                'metodo_pago_pag' => MetodoPagoEnum::QR->value,
                'estado_pago_pag' => $estadoPag,
                'monto_pag' => $total,
                'referencia_pag' => 'QR-WEB-' . rand(100000, 999999),
                'fecha_pago_pag' => $fecha->toDateString(),
                'observacion_pag' => 'Pago por pasarela QR web.',
            ]);
            $pago->created_at = $fecha;
            $pago->save();

            // 7. Crear PagoTienda
            $pagoTienda = PagoTienda::create([
                'cod_pago' => $pago->cod_pago,
                'cod_checkout_sesion' => $checkout->cod_checkout_sesion,
                'user_id' => $user->id,
                'comprobante_ruta_pwe' => 'demo/comprobantes/placeholder.png',
                'comprobante_hash_pwe' => hash('sha256', 'placeholder-content'),
                'banco_origen_pwe' => 'BANCO NACIONAL DE BOLIVIA',
                'fecha_subida_comprobante_pwe' => $fecha,
                'intentos_pago_pwe' => 1,
            ]);

            // 8. Crear ComprobantePagoTienda
            $estadoCpt = 'pendiente';
            if ($estadoPag === EstadoPagoEnum::PAGADO->value) {
                $estadoCpt = 'aprobado';
            } elseif ($estadoPag === EstadoPagoEnum::RECHAZADO->value) {
                $estadoCpt = 'rechazado';
            }

            ComprobantePagoTienda::create([
                'cod_pago_tienda' => $pagoTienda->cod_pago_tienda,
                'ruta_comprobante_cpt' => 'demo/comprobantes/placeholder.png',
                'hash_comprobante_cpt' => hash('sha256', 'placeholder-content'),
                'mime_cpt' => 'image/png',
                'tamano_bytes_cpt' => 24500,
                'estado_cpt' => $estadoCpt,
                'observacion_admin_cpt' => $estadoCpt === 'aprobado' ? 'Validación automática web aprobada.' : 'Pendiente de control manual.',
                'subido_por_user_id' => $user->id,
                'revisado_por_user_id' => $estadoCpt === 'aprobado' ? $adminId : null,
                'subido_en_cpt' => $fecha,
                'revisado_en_cpt' => $estadoCpt === 'aprobado' ? $fecha->copy()->addMinutes(5) : null,
            ]);

            // 9. Crear Factura Interna (comprobante) si está Aceptado
            if ($estadoPte === 'aceptado') {
                $factura = Factura::create([
                    'cod_pedido' => $pedido->cod_pedido,
                    'cod_pago' => $pago->cod_pago,
                    'cod_checkout_sesion' => $checkout->cod_checkout_sesion,
                    'numero_factura_fac' => sprintf('FAC-%s-%06d', $fecha->format('Y'), $i),
                    'tipo_comprobante_fac' => TipoComprobanteEnum::FACTURA->value,
                    'estado_fac' => EstadoFacturaEnum::EMITIDA->value,
                    'fecha_emision_fac' => $fecha->toDateString(),
                    'documento_cliente_fac' => $cliente->documento_cli ?? '1234567',
                    'razon_social_cliente_fac' => $cliente->nombre_cli,
                    'direccion_fiscal_fac' => $direccion->direccion_dir,
                    'subtotal_fac' => $subtotal,
                    'descuento_fac' => 0.00,
                    'impuesto_fac' => round($subtotal * 0.13, 2), // 13% IVA
                    'total_fac' => $total,
                    'moneda_fac' => 'BOB',
                    'codigo_control_fac' => strtoupper(Str::random(10)),
                    'observacion_fac' => 'Factura electrónica emitida automáticamente.',
                    'emitida_por_user_id' => $adminId,
                ]);

                $factura->created_at = $fecha;
                $factura->save();

                // Crear detalles factura
                foreach ($detallesCreados as $detalleCreado) {
                    $productoObj = $productos->firstWhere('cod_producto', $detalleCreado->cod_producto);
                    DetalleFactura::create([
                        'cod_factura' => $factura->cod_factura,
                        'cod_producto' => $detalleCreado->cod_producto,
                        'cod_detalle_pedido' => $detalleCreado->cod_detalle_pedido,
                        'descripcion_dfa' => $productoObj?->nombre_pro ?? 'Prenda de vestir',
                        'cantidad_dfa' => $detalleCreado->cantidad_det,
                        'precio_unitario_dfa' => $detalleCreado->precio_unitario_det,
                        'subtotal_dfa' => $detalleCreado->subtotal_det,
                    ]);
                }
            }
        }
    }
}
