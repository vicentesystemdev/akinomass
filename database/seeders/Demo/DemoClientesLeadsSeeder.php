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
use Carbon\Carbon;

class DemoClientesLeadsSeeder extends Seeder
{
    public function run(): void
    {
        $canales = CanalVenta::query()->pluck('cod_canal_venta', 'codigo_can');
        $flujos = TipoFlujoComercial::query()->pluck('cod_tipo_flujo_comercial', 'codigo_tip');

        $clientesData = [
            [
                'nombre_cli' => 'María René Flores',
                'telefono_cli' => '71524312',
                'correo_cli' => 'maria.flores@akinomass.local',
                'direccion_cli' => 'Sopocachi, Av. Ecuador, La Paz',
                'documento_cli' => '6798124 LP',
                'estado_cli' => EstadoClienteEnum::RECURRENTE->value,
                'canal' => 'tiktok_live',
                'flujo' => 'venta_en_vivo',
                'observacion' => 'Compradora frecuente de blusas y vestidos en Lives. Prefiere entrega en la tarde.',
                'meses_atras' => 10
            ],
            [
                'nombre_cli' => 'Carlos Mamani Quispe',
                'telefono_cli' => '68012456',
                'correo_cli' => 'carlos.mamani@akinomass.local',
                'direccion_cli' => 'Ciudad Satélite, Plan 482, El Alto',
                'documento_cli' => '8493021 LP',
                'estado_cli' => EstadoClienteEnum::ACTIVO->value,
                'canal' => 'whatsapp',
                'flujo' => 'conversacion_directa',
                'observacion' => 'Cliente nuevo. Muy interesado en poleras oversize de algodón.',
                'meses_atras' => 1
            ],
            [
                'nombre_cli' => 'Patricia Rojas Beltrán',
                'telefono_cli' => '73045981',
                'correo_cli' => 'patricia.rojas@akinomass.local',
                'direccion_cli' => 'Miraflores, Calle Diaz Romero, La Paz',
                'documento_cli' => '5983412 LP',
                'estado_cli' => EstadoClienteEnum::ACTIVO->value, // Representa frecuente
                'canal' => 'instagram',
                'flujo' => 'conversacion_directa',
                'observacion' => 'Cliente frecuente de Instagram. Le gusta estar al tanto de los lanzamientos de jeans.',
                'meses_atras' => 8
            ],
            [
                'nombre_cli' => 'Diego Quispe Condori',
                'telefono_cli' => '72049182',
                'correo_cli' => 'diego.quispe@akinomass.local',
                'direccion_cli' => 'Villa Adela, Calle 4, El Alto',
                'documento_cli' => '9128301 LP',
                'estado_cli' => EstadoClienteEnum::ACTIVO->value,
                'canal' => 'venta_directa',
                'flujo' => 'venta_directa',
                'observacion' => 'Cliente de retiro directo en showroom. Suele comprar chamarras y abrigos.',
                'meses_atras' => 5
            ],
            [
                'nombre_cli' => 'Lucía Zalles Fernández',
                'telefono_cli' => '70654312',
                'correo_cli' => 'lucia.zalles@akinomass.local',
                'direccion_cli' => 'Calacoto, Calle 15, La Paz',
                'documento_cli' => '4829102 LP',
                'estado_cli' => EstadoClienteEnum::INACTIVO->value,
                'canal' => 'web',
                'flujo' => 'compra_web',
                'observacion' => 'Cliente antiguo. No ha registrado compras en los últimos 6 meses.',
                'meses_atras' => 11
            ],
            [
                'nombre_cli' => 'Ronald Vaca Pinto',
                'telefono_cli' => '71239845',
                'correo_cli' => 'ronald.vaca@akinomass.local',
                'direccion_cli' => 'San Pedro, Calle Cañada Strongest, La Paz',
                'documento_cli' => '6192834 LP',
                'estado_cli' => EstadoClienteEnum::RECURRENTE->value,
                'canal' => 'marketplace',
                'flujo' => 'marketplace',
                'observacion' => 'Pregunta mucho en publicaciones pero concreta rápido vía WhatsApp. Busca jeans.',
                'meses_atras' => 3
            ],
            [
                'nombre_cli' => 'Mariana Limachi Suxo',
                'telefono_cli' => '69830214',
                'correo_cli' => 'mariana.limachi@akinomass.local',
                'direccion_cli' => 'Río Seco, Av. Juan Pablo II, El Alto',
                'documento_cli' => '8342910 LP',
                'estado_cli' => EstadoClienteEnum::ACTIVO->value,
                'canal' => 'whatsapp',
                'flujo' => 'referido',
                'observacion' => 'Referida por su hermana. Compra ropa deportiva y poleras básicas.',
                'meses_atras' => 4
            ]
        ];

        $clientes = [];
        foreach ($clientesData as $cData) {
            $fechaRegistro = Carbon::now()->subMonths($cData['meses_atras'])->subDays(rand(1, 28));
            $cliente = Cliente::updateOrCreate(
                ['correo_cli' => $cData['correo_cli']],
                [
                    'nombre_cli' => $cData['nombre_cli'],
                    'telefono_cli' => $cData['telefono_cli'],
                    'direccion_cli' => $cData['direccion_cli'],
                    'documento_cli' => $cData['documento_cli'],
                    'observacion_cli' => $cData['observacion'],
                    'estado_cli' => $cData['estado_cli'],
                    'cod_canal_venta' => $canales[$cData['canal']] ?? null,
                    'cod_tipo_flujo_comercial' => $flujos[$cData['flujo']] ?? null,
                ]
            );
            $cliente->created_at = $fechaRegistro;
            $cliente->save();
            $clientes[$cData['correo_cli']] = $cliente;
        }

        $vendedor = User::where('email', 'vendedor@akinomass.local')->first();
        $supervisor = User::where('email', 'supervisor@akinomass.local')->first();

        $leadsData = [
            [
                'nombre_lea' => 'Andrea Salazar',
                'alias_lea' => '@andrea_sal',
                'telefono_lea' => '70111111',
                'correo_lea' => 'andrea.salazar@akinomass.local',
                'producto_interes_lea' => 'Jean Mom Fit Azul',
                'estado_lea' => EstadoLeadEnum::NUEVO->value,
                'canal' => 'tiktok_live',
                'flujo' => 'venta_en_vivo',
                'cod_cliente' => null,
                'usuario' => $vendedor?->id,
                'observacion' => 'Preguntó por tallas 30 y 32 del Jean Mom Fit en la transmisión en vivo.'
            ],
            [
                'nombre_lea' => 'Miguel Castro Soliz',
                'alias_lea' => '@miguel_cs',
                'telefono_lea' => '70222222',
                'correo_lea' => 'miguel.castro@akinomass.local',
                'producto_interes_lea' => 'Chamarra Jean Clásica',
                'estado_lea' => EstadoLeadEnum::CONTACTADO->value,
                'canal' => 'instagram',
                'flujo' => 'conversacion_directa',
                'cod_cliente' => null,
                'usuario' => $supervisor?->id,
                'observacion' => 'Se le envió la tabla de medidas de chamarras por mensaje privado de Instagram.'
            ],
            [
                'nombre_lea' => 'Valeria Paredes Mercado',
                'alias_lea' => null,
                'telefono_lea' => '70333333',
                'correo_lea' => 'valeria.paredes@akinomass.local',
                'producto_interes_lea' => 'Blusa Satinada Manga Larga',
                'estado_lea' => EstadoLeadEnum::INTERESADO->value,
                'canal' => 'whatsapp',
                'flujo' => 'conversacion_directa',
                'cod_cliente' => null,
                'usuario' => $vendedor?->id,
                'observacion' => 'Interesada en colores negro y beige. Esperando confirmación de stock.'
            ],
            [
                'nombre_lea' => 'Sergio Ortiz Luna',
                'alias_lea' => '@sergio_ol',
                'telefono_lea' => '70444444',
                'correo_lea' => 'sergio.ortiz@akinomass.local',
                'producto_interes_lea' => 'Polera Oversize Básica',
                'estado_lea' => EstadoLeadEnum::PENDIENTE_PAGO->value,
                'canal' => 'marketplace',
                'flujo' => 'marketplace',
                'cod_cliente' => $clientes['ronald.vaca@akinomass.local']->cod_cliente ?? null,
                'usuario' => $supervisor?->id,
                'observacion' => 'Reservó 2 poleras oversize. Dijo que haría la transferencia bancaria hoy por la tarde.'
            ],
            [
                'nombre_lea' => 'Mariana Limachi Suxo',
                'alias_lea' => null,
                'telefono_lea' => '69830214',
                'correo_lea' => 'mariana.limachi@akinomass.local',
                'producto_interes_lea' => 'Conjunto Deportivo Urbano',
                'estado_lea' => EstadoLeadEnum::CONVERTIDO->value,
                'canal' => 'whatsapp',
                'flujo' => 'referido',
                'cod_cliente' => $clientes['mariana.limachi@akinomass.local']->cod_cliente ?? null,
                'usuario' => $vendedor?->id,
                'observacion' => 'Convertida a cliente tras concretar la compra de un conjunto deportivo rosado M.'
            ],
            [
                'nombre_lea' => 'Jorge Nina Huanaco',
                'alias_lea' => '@jorge_nh',
                'telefono_lea' => '70666666',
                'correo_lea' => 'jorge.nina@akinomass.local',
                'producto_interes_lea' => 'Chamarra Rompeviento',
                'estado_lea' => EstadoLeadEnum::PERDIDO->value,
                'canal' => 'instagram',
                'flujo' => 'conversacion_directa',
                'cod_cliente' => null,
                'usuario' => $vendedor?->id,
                'observacion' => 'No respondió a los mensajes de seguimiento sobre colores disponibles. Lead inactivo.'
            ],
            [
                'nombre_lea' => 'Paola Céspedes Rojas',
                'alias_lea' => null,
                'telefono_lea' => '70777777',
                'correo_lea' => 'paola.cespedes@akinomass.local',
                'producto_interes_lea' => 'Falda Plisada Negra',
                'estado_lea' => EstadoLeadEnum::DESCARTADO->value,
                'canal' => 'web',
                'flujo' => 'compra_web',
                'cod_cliente' => null,
                'usuario' => $supervisor?->id,
                'observacion' => 'El número ingresado estaba equivocado y no pudimos contactarla.'
            ],
            [
                'nombre_lea' => 'Camila Arce Prado',
                'alias_lea' => '@camila_ap',
                'telefono_lea' => '70999999',
                'correo_lea' => 'camila.arce@akinomass.local',
                'producto_interes_lea' => 'Vestido Casual Floreado',
                'estado_lea' => EstadoLeadEnum::INTERESADO->value,
                'canal' => 'tiktok_live',
                'flujo' => 'venta_en_vivo',
                'cod_cliente' => null,
                'usuario' => $vendedor?->id,
                'observacion' => 'Participó activamente en el Live. Pidió reserva de Vestido Floreado en talla S.'
            ],
        ];

        foreach ($leadsData as $lData) {
            $fechaSeguimiento = Carbon::now()->addDays(rand(1, 5));
            Lead::updateOrCreate(
                ['correo_lea' => $lData['correo_lea']],
                [
                    'nombre_lea' => $lData['nombre_lea'],
                    'alias_lea' => $lData['alias_lea'],
                    'telefono_lea' => $lData['telefono_lea'],
                    'producto_interes_lea' => $lData['producto_interes_lea'],
                    'observacion_lea' => $lData['observacion'],
                    'estado_lea' => $lData['estado_lea'],
                    'fecha_seguimiento_lea' => $fechaSeguimiento->toDateString(),
                    'cod_canal_venta' => $canales[$lData['canal']] ?? null,
                    'cod_tipo_flujo_comercial' => $flujos[$lData['flujo']] ?? null,
                    'cod_cliente' => $lData['cod_cliente'],
                    'cod_usuario_responsable' => $lData['usuario'],
                ]
            );
        }
    }
}
