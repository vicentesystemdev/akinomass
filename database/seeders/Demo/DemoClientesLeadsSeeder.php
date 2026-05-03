<?php

namespace Database\Seeders\Demo;

use App\Domains\CRM\Clientes\Enums\EstadoClienteEnum;
use App\Domains\CRM\Leads\Enums\EstadoLeadEnum;
use App\Models\CanalVenta;
use App\Models\Cliente;
use App\Models\Lead;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoClientesLeadsSeeder extends Seeder
{
    public function run(): void
    {
        $canales = CanalVenta::query()->pluck('cod_canal_venta', 'codigo_can');
        $flujos = TipoFlujoComercial::query()->pluck('cod_tipo_flujo_comercial', 'codigo_tip');

        $clientesData = [
            ['nombre_cli' => 'María López', 'telefono_cli' => '70010011', 'correo_cli' => 'maria.lopez.demo@correo.test', 'direccion_cli' => 'Zona Norte, La Paz', 'documento_cli' => 'CI-ML-001', 'estado_cli' => EstadoClienteEnum::ACTIVO->value, 'canal' => 'whatsapp', 'flujo' => 'conversacion_directa'],
            ['nombre_cli' => 'Carlos Mendoza', 'telefono_cli' => '70020022', 'correo_cli' => 'carlos.mendoza.demo@correo.test', 'direccion_cli' => 'Achumani, La Paz', 'documento_cli' => 'CI-CM-002', 'estado_cli' => EstadoClienteEnum::RECURRENTE->value, 'canal' => 'instagram', 'flujo' => 'campania_marketing'],
            ['nombre_cli' => 'Patricia Rojas', 'telefono_cli' => '70030033', 'correo_cli' => 'patricia.rojas.demo@correo.test', 'direccion_cli' => 'Sopocachi, La Paz', 'documento_cli' => 'CI-PR-003', 'estado_cli' => EstadoClienteEnum::ACTIVO->value, 'canal' => 'facebook', 'flujo' => 'marketplace'],
            ['nombre_cli' => 'Diego Quispe', 'telefono_cli' => '70040044', 'correo_cli' => 'diego.quispe.demo@correo.test', 'direccion_cli' => 'Miraflores, La Paz', 'documento_cli' => 'CI-DQ-004', 'estado_cli' => EstadoClienteEnum::ACTIVO->value, 'canal' => 'venta_directa', 'flujo' => 'venta_directa'],
            ['nombre_cli' => 'Lucía Fernández', 'telefono_cli' => '70050055', 'correo_cli' => 'lucia.fernandez.demo@correo.test', 'direccion_cli' => 'Calacoto, La Paz', 'documento_cli' => 'CI-LF-005', 'estado_cli' => EstadoClienteEnum::INACTIVO->value, 'canal' => 'web', 'flujo' => 'referido'],
        ];

        $clientes = [];
        foreach ($clientesData as $clienteData) {
            $clientes[$clienteData['correo_cli']] = Cliente::updateOrCreate(
                ['correo_cli' => $clienteData['correo_cli']],
                [
                    'nombre_cli' => $clienteData['nombre_cli'],
                    'telefono_cli' => $clienteData['telefono_cli'],
                    'direccion_cli' => $clienteData['direccion_cli'],
                    'documento_cli' => $clienteData['documento_cli'],
                    'observacion_cli' => 'Cliente de demostración para AKINOMASS.',
                    'estado_cli' => $clienteData['estado_cli'],
                    'cod_canal_venta' => $canales[$clienteData['canal']] ?? null,
                    'cod_tipo_flujo_comercial' => $flujos[$clienteData['flujo']] ?? null,
                ],
            );
        }

        $vendedor = User::where('email', 'vendedor.demo@akinomass.test')->first();
        $supervisor = User::where('email', 'supervisor.demo@akinomass.test')->first();

        $leadsData = [
            ['nombre_lea' => 'Andrea Salazar', 'alias_lea' => '@andreas', 'telefono_lea' => '70111111', 'correo_lea' => 'andrea.salazar.demo@correo.test', 'producto_interes_lea' => 'Aro de luz 18"', 'estado_lea' => EstadoLeadEnum::NUEVO->value, 'canal' => 'tiktok_live', 'flujo' => 'venta_en_vivo', 'cod_cliente' => null, 'usuario' => $vendedor?->id],
            ['nombre_lea' => 'Miguel Castro', 'alias_lea' => '@miguelc', 'telefono_lea' => '70222222', 'correo_lea' => 'miguel.castro.demo@correo.test', 'producto_interes_lea' => 'Micrófono inalámbrico', 'estado_lea' => EstadoLeadEnum::CONTACTADO->value, 'canal' => 'instagram', 'flujo' => 'conversacion_directa', 'cod_cliente' => null, 'usuario' => $supervisor?->id],
            ['nombre_lea' => 'Valeria Paredes', 'alias_lea' => null, 'telefono_lea' => '70333333', 'correo_lea' => 'valeria.paredes.demo@correo.test', 'producto_interes_lea' => 'Kit streaming básico', 'estado_lea' => EstadoLeadEnum::INTERESADO->value, 'canal' => 'whatsapp', 'flujo' => 'conversacion_directa', 'cod_cliente' => null, 'usuario' => $vendedor?->id],
            ['nombre_lea' => 'Sergio Ortiz', 'alias_lea' => '@sergio_market', 'telefono_lea' => '70444444', 'correo_lea' => 'sergio.ortiz.demo@correo.test', 'producto_interes_lea' => 'Trípode profesional', 'estado_lea' => EstadoLeadEnum::PENDIENTE_PAGO->value, 'canal' => 'marketplace', 'flujo' => 'marketplace', 'cod_cliente' => $clientes['carlos.mendoza.demo@correo.test']->cod_cliente ?? null, 'usuario' => $supervisor?->id],
            ['nombre_lea' => 'Mariana Limachi', 'alias_lea' => null, 'telefono_lea' => '70555555', 'correo_lea' => 'mariana.limachi.demo@correo.test', 'producto_interes_lea' => 'Aro de luz premium', 'estado_lea' => EstadoLeadEnum::CONVERTIDO->value, 'canal' => 'facebook', 'flujo' => 'campania_marketing', 'cod_cliente' => $clientes['patricia.rojas.demo@correo.test']->cod_cliente ?? null, 'usuario' => $vendedor?->id],
            ['nombre_lea' => 'Jorge Nina', 'alias_lea' => '@jorgen', 'telefono_lea' => '70666666', 'correo_lea' => 'jorge.nina.demo@correo.test', 'producto_interes_lea' => 'Mesa plegable para live', 'estado_lea' => EstadoLeadEnum::PERDIDO->value, 'canal' => 'telegram', 'flujo' => 'otro', 'cod_cliente' => null, 'usuario' => $vendedor?->id],
            ['nombre_lea' => 'Paola Céspedes', 'alias_lea' => null, 'telefono_lea' => '70777777', 'correo_lea' => 'paola.cespedes.demo@correo.test', 'producto_interes_lea' => 'Soporte para celular', 'estado_lea' => EstadoLeadEnum::DESCARTADO->value, 'canal' => 'web', 'flujo' => 'referido', 'cod_cliente' => null, 'usuario' => $supervisor?->id],
            ['nombre_lea' => 'Ronald Vaca', 'alias_lea' => '@ronv', 'telefono_lea' => '70888888', 'correo_lea' => 'ronald.vaca.demo@correo.test', 'producto_interes_lea' => 'Kit audio + iluminación', 'estado_lea' => EstadoLeadEnum::INTERESADO->value, 'canal' => 'tiktok_live', 'flujo' => 'venta_en_vivo', 'cod_cliente' => null, 'usuario' => $vendedor?->id],
        ];

        foreach ($leadsData as $leadData) {
            Lead::updateOrCreate(
                ['correo_lea' => $leadData['correo_lea']],
                [
                    'nombre_lea' => $leadData['nombre_lea'],
                    'alias_lea' => $leadData['alias_lea'],
                    'telefono_lea' => $leadData['telefono_lea'],
                    'producto_interes_lea' => $leadData['producto_interes_lea'],
                    'observacion_lea' => 'Lead de demostración generado para presentación comercial.',
                    'estado_lea' => $leadData['estado_lea'],
                    'fecha_seguimiento_lea' => now()->addDays(2)->toDateString(),
                    'cod_canal_venta' => $canales[$leadData['canal']] ?? null,
                    'cod_tipo_flujo_comercial' => $flujos[$leadData['flujo']] ?? null,
                    'cod_cliente' => $leadData['cod_cliente'],
                    'cod_usuario_responsable' => $leadData['usuario'],
                ],
            );
        }
    }
}
