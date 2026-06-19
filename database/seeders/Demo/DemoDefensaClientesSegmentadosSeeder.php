<?php

namespace Database\Seeders\Demo;

use App\Models\CanalVenta;
use App\Models\Cliente;
use App\Models\Lead;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use App\Domains\CRM\Clientes\Enums\EstadoClienteEnum;
use App\Domains\CRM\Leads\Enums\EstadoLeadEnum;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DemoDefensaClientesSegmentadosSeeder extends Seeder
{
    public function run(): void
    {
        $canales = CanalVenta::pluck('cod_canal_venta', 'codigo_can')->toArray();
        $flujos = TipoFlujoComercial::pluck('cod_tipo_flujo_comercial', 'codigo_tip')->toArray();

        $vendedores = User::role('Vendedor')->pluck('id')->toArray();
        $supervisor = User::role('Supervisor Comercial')->first()?->id;
        $defaultUser = $vendedores[0] ?? $supervisor;

        $nombresMasculinos = ['José', 'Juan', 'Carlos', 'Luis', 'Jorge', 'Víctor', 'René', 'Miguel', 'Julio', 'César', 'Walter', 'Hugo', 'Pedro', 'Manuel', 'Jaime', 'Roberto', 'Edgar', 'Mario', 'Francisco', 'Ramiro'];
        $nombresFemeninos = ['María', 'Ana', 'Juana', 'Elizabeth', 'Martha', 'Teresa', 'Patricia', 'Janet', 'Nancy', 'Silvia', 'Gloria', 'Sandra', 'Alicia', 'Rosa', 'Carmen', 'Lidia', 'Julia', 'Sonia', 'Yolanda', 'Miriam'];
        $apellidos = ['Quispe', 'Mamani', 'Flores', 'Condori', 'Choque', 'Rodríguez', 'Vargas', 'Gutiérrez', 'Cruz', 'Ramos', 'Apaza', 'Torrico', 'Mendoza', 'Aguilar', 'Ortiz', 'Rojas', 'López', 'Gómez', 'Castillo', 'Guzmán'];
        $zonas = ['La Paz Centro', 'Sopocachi', 'Miraflores', 'Villa Fátima', 'San Pedro', 'Max Paredes', 'Obrajes', 'Calacoto', 'El Alto Ceja', 'Villa Adela', 'Río Seco', 'Satélite'];

        // Definimos los canales con sus pesos acumulativos
        $canalesPesos = [
            ['canal' => 'tiktok_live', 'flujo' => 'venta_en_vivo', 'peso' => 45],
            ['canal' => 'whatsapp', 'flujo' => 'conversacion_directa', 'peso' => 70], // 45 + 25
            ['canal' => 'instagram', 'flujo' => 'conversacion_directa', 'peso' => 88], // 70 + 18
            ['canal' => 'facebook', 'flujo' => 'conversacion_directa', 'peso' => 96], // 88 + 8
            ['canal' => 'web', 'flujo' => 'compra_web', 'peso' => 100], // 96 + 4
        ];

        // Crearemos 245 clientes.
        // Distribución:
        // A. Alto valor / Frecuentes: 40 clientes
        // B. Ocasionales: 95 clientes
        // C. Nuevos: 50 clientes
        // D. En riesgo: 40 clientes
        // E. Sin compra: 20 clientes
        $totalClientes = 245;

        for ($i = 1; $i <= $totalClientes; $i++) {
            // Nombre determinista
            $esFemenino = ($i % 2 === 0);
            $primerNombre = $esFemenino ? $nombresFemeninos[$i % 20] : $nombresMasculinos[$i % 20];
            $apellidoPaterno = $apellidos[($i + 3) % 20];
            $apellidoMaterno = $apellidos[($i + 7) % 20];
            $nombreCompleto = "{$primerNombre} {$apellidoPaterno} {$apellidoMaterno}";

            // Dirección y datos
            $zona = $zonas[$i % 12];
            $calle = ($i % 15) + 1;
            $numero = ($i * 7) % 1000;
            $direccion = "{$zona}, Calle {$calle} #{$numero}";
            $telefono = rand(60000000, 79999999);
            $documento = rand(4000000, 9999999) . ' ' . ($i % 2 === 0 ? 'LP' : 'CB');
            $correo = sprintf('cliente%03d@demo.akinomass.test', $i);

            // Canal y flujo deterministas
            $randCanalVal = ($i * 17) % 100;
            $canalElegido = 'whatsapp';
            $flujoElegido = 'conversacion_directa';
            foreach ($canalesPesos as $cp) {
                if ($randCanalVal <= $cp['peso']) {
                    $canalElegido = $cp['canal'];
                    $flujoElegido = $cp['flujo'];
                    break;
                }
            }

            // Todos los clientes de clustering deben estar con estado 'activo'
            $estado = EstadoClienteEnum::ACTIVO->value;
            // Para los sin compra, podemos ponerlos activos o inactivos, pero dejémoslos en activo para consistencia del CRM.
            
            $cliente = Cliente::create([
                'nombre_cli' => $nombreCompleto,
                'telefono_cli' => (string) $telefono,
                'correo_cli' => $correo,
                'direccion_cli' => $direccion,
                'documento_cli' => $documento,
                'observacion_cli' => 'Cliente demo de defensa académica.',
                'estado_cli' => $estado,
                'cod_canal_venta' => $canales[$canalElegido] ?? reset($canales),
                'cod_tipo_flujo_comercial' => $flujos[$flujoElegido] ?? reset($flujos),
            ]);

            // Forzar fecha de registro histórica controlada
            $fechaRegistro = Carbon::parse('2025-07-01')->addDays(($i * 13) % 250);
            $cliente->created_at = $fechaRegistro;
            $cliente->updated_at = $fechaRegistro;
            $cliente->save();

            // Crear el correspondiente usuario y cuenta de cliente
            $user = User::create([
                'name' => $nombreCompleto,
                'email' => $correo,
                'password' => bcrypt('password'),
            ]);
            $user->syncRoles(['Cliente']);

            \App\Models\CuentaCliente::create([
                'user_id' => $user->id,
                'cod_cliente' => $cliente->cod_cliente,
                'estado_cue' => 'activa',
                'fecha_activacion_cue' => $fechaRegistro,
            ]);
        }

        // Crearemos 150 leads.
        // Estados: nuevo, contactado, interesado, convertido, descartado, perdido.
        $totalLeads = 150;
        $estadosLeads = [
            EstadoLeadEnum::NUEVO->value,
            EstadoLeadEnum::CONTACTADO->value,
            EstadoLeadEnum::INTERESADO->value,
            EstadoLeadEnum::CONVERTIDO->value,
            EstadoLeadEnum::DESCARTADO->value,
            EstadoLeadEnum::PERDIDO->value,
        ];

        for ($i = 1; $i <= $totalLeads; $i++) {
            $esFemenino = ($i % 2 !== 0);
            $primerNombre = $esFemenino ? $nombresFemeninos[$i % 20] : $nombresMasculinos[$i % 20];
            $apellidoPaterno = $apellidos[($i + 5) % 20];
            $apellidoMaterno = $apellidos[($i + 9) % 20];
            $nombreCompleto = "{$primerNombre} {$apellidoPaterno} {$apellidoMaterno}";

            $telefono = rand(60000000, 79999999);
            $correo = sprintf('lead%03d@demo.akinomass.test', $i);
            $alias = '@lead_alias_' . $i;

            $randCanalVal = ($i * 19) % 100;
            $canalElegido = 'whatsapp';
            $flujoElegido = 'conversacion_directa';
            foreach ($canalesPesos as $cp) {
                if ($randCanalVal <= $cp['peso']) {
                    $canalElegido = $cp['canal'];
                    $flujoElegido = $cp['flujo'];
                    break;
                }
            }

            $estado = $estadosLeads[$i % count($estadosLeads)];
            $usuarioResp = !empty($vendedores) ? $vendedores[$i % count($vendedores)] : $defaultUser;

            // Vincular algunos leads convertidos a clientes reales
            $codCliente = null;
            if ($estado === EstadoLeadEnum::CONVERTIDO->value) {
                // Vincular a un cliente de forma secuencial
                $codCliente = ($i % 150) + 1; // Rango de clientes 1 a 150
            }

            $lead = Lead::create([
                'nombre_lea' => $nombreCompleto,
                'alias_lea' => $alias,
                'telefono_lea' => (string) $telefono,
                'correo_lea' => $correo,
                'producto_interes_lea' => 'Prenda Colección Moda',
                'observacion_lea' => 'Lead demo de redes sociales.',
                'estado_lea' => $estado,
                'fecha_seguimiento_lea' => Carbon::parse('2026-06-10')->addDays($i % 9)->toDateString(),
                'cod_canal_venta' => $canales[$canalElegido] ?? reset($canales),
                'cod_tipo_flujo_comercial' => $flujos[$flujoElegido] ?? reset($flujos),
                'cod_cliente' => $codCliente,
                'cod_usuario_responsable' => $usuarioResp,
            ]);

            $fechaLead = Carbon::parse('2025-08-01')->addDays(($i * 11) % 280);
            $lead->created_at = $fechaLead;
            $lead->updated_at = $fechaLead;
            $lead->save();
        }
    }
}
