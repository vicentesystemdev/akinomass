<?php

namespace Database\Seeders\Demo;

use App\Models\CheckoutSesion;
use App\Models\ComprobantePagoTienda;
use App\Models\CuentaCliente;
use App\Models\DireccionCliente;
use App\Models\Pago;
use App\Models\PagoTienda;
use App\Models\Pedido;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DemoDefensaPagosComprobantesSeeder extends Seeder
{
    public function run(): void
    {
        // Enlazar comprobantes demo a los primeros 60 pedidos que simulan haber sido completados vía web/tienda o pagos QR
        // Obtener los primeros 60 pedidos entregados/confirmados
        $pedidos = Pedido::where('estado_ped', '!=', 'cancelado')
            ->orderBy('cod_pedido')
            ->take(60)
            ->get();

        $this->command->info('Creando comprobantes de pago tienda para ' . $pedidos->count() . ' pedidos...');

        // Asegurarse de que existan Cuentas de Cliente y Direcciones de Cliente
        // (ya creados en DemoDefensaClientesSegmentadosSeeder)
        $cuentas = CuentaCliente::all();
        $direcciones = DireccionCliente::all();

        if ($cuentas->isEmpty()) {
            $this->command->error('No hay cuentas de cliente precargadas. No se pueden generar comprobantes de checkout.');
            return;
        }

        $pIndex = 1;
        foreach ($pedidos as $pedido) {
            $pago = Pago::where('cod_pedido', $pedido->cod_pedido)->first();
            if (!$pago) {
                continue;
            }

            $cuenta = $cuentas->where('cod_cliente', $pedido->cod_cliente)->first();
            if (!$cuenta) {
                // Crear cuenta cliente de forma rápida si no existe
                $cuenta = CuentaCliente::create([
                    'user_id' => User::role('Cliente')->first()?->id ?? 1,
                    'cod_cliente' => $pedido->cod_cliente,
                    'estado_cue' => 'activa',
                    'fecha_activacion_cue' => Carbon::now()->subMonths(1),
                ]);
            }

            $direccion = $direcciones->where('cod_cliente', $pedido->cod_cliente)->first();
            if (!$direccion) {
                $direccion = DireccionCliente::create([
                    'cod_cliente' => $pedido->cod_cliente,
                    'etiqueta_dir' => 'Casa',
                    'nombre_destinatario_dir' => $pedido->cliente->nombre_cli,
                    'telefono_dir' => $pedido->cliente->telefono_cli ?? '70000000',
                    'direccion_dir' => $pedido->cliente->direccion_cli ?? 'Dirección Demo',
                    'es_predeterminada_dir' => true,
                    'activo_dir' => true,
                ]);
            }

            // Crear sesión de checkout ficticia para respaldar el pago tienda
            $checkout = CheckoutSesion::create([
                'cod_cuenta_cliente' => $cuenta->cod_cuenta_cliente,
                'cod_carrito' => null,
                'cod_direccion_cliente' => $direccion->cod_direccion_cliente,
                'estado_che' => 'completado',
                'email_contacto_che' => $pedido->cliente->correo_cli ?? 'cliente@demo.akinomass.test',
                'telefono_contacto_che' => $pedido->cliente->telefono_cli ?? '70000000',
                'direccion_entrega_che' => $direccion->direccion_dir,
                'documento_facturacion_che' => $pedido->cliente->documento_cli ?? '1234567',
                'razon_social_che' => $pedido->cliente->nombre_cli,
                'subtotal_che' => $pedido->subtotal_ped,
                'descuento_che' => $pedido->descuento_ped,
                'total_che' => $pedido->total_ped,
                'metodo_pago_elegido_che' => $pago->metodo_pago_pag,
                'referencia_pago_che' => $pago->referencia_pag,
                'comprobante_ruta_che' => 'demo/comprobantes/placeholder.png',
                'token_che' => (string) Str::uuid(),
                'expira_en_che' => Carbon::parse($pedido->created_at)->addHours(2),
                'completado_en_che' => $pedido->created_at,
            ]);

            // Crear PagoTienda
            $pagoTienda = PagoTienda::create([
                'cod_pago' => $pago->cod_pago,
                'cod_checkout_sesion' => $checkout->cod_checkout_sesion,
                'user_id' => $cuenta->user_id,
                'comprobante_ruta_pwe' => 'demo/comprobantes/placeholder.png',
                'comprobante_hash_pwe' => hash('sha256', 'placeholder-content'),
                'banco_origen_pwe' => $pedido->cod_cliente % 2 === 0 ? 'BANCO MERCANTIL SANTA CRUZ' : 'BANCO UNION',
                'fecha_subida_comprobante_pwe' => $pedido->created_at,
                'intentos_pago_pwe' => 1,
            ]);

            // Crear ComprobantePagoTienda
            $estadoCpt = 'aprobado';
            if ($pago->estado_pago_pag === 'observado') {
                $estadoCpt = 'observado';
            } elseif ($pago->estado_pago_pag === 'rechazado') {
                $estadoCpt = 'rechazado';
            }

            ComprobantePagoTienda::create([
                'cod_pago_tienda' => $pagoTienda->cod_pago_tienda,
                'ruta_comprobante_cpt' => 'demo/comprobantes/placeholder.png',
                'hash_comprobante_cpt' => hash('sha256', 'placeholder-content'),
                'mime_cpt' => 'image/png',
                'tamano_bytes_cpt' => 24500,
                'estado_cpt' => $estadoCpt,
                'observacion_admin_cpt' => $estadoCpt === 'aprobado' ? 'Comprobante verificado con éxito.' : 'Comprobante borroso o monto no coincide.',
                'subido_por_user_id' => $cuenta->user_id,
                'revisado_por_user_id' => User::role('Administrador')->first()?->id ?? 1,
                'subido_en_cpt' => $pedido->created_at,
                'revisado_en_cpt' => Carbon::parse($pedido->created_at)->addMinutes(15),
            ]);

            $pIndex++;
        }
    }
}
