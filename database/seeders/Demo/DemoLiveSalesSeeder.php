<?php

namespace Database\Seeders\Demo;

use App\Domains\Comercial\LiveSales\Enums\EstadoInteraccionLiveEnum;
use App\Domains\Comercial\LiveSales\Enums\EstadoSesionLiveEnum;
use App\Domains\CRM\Leads\Enums\EstadoLeadEnum;
use App\Models\CanalVenta;
use App\Models\InteraccionLive;
use App\Models\Lead;
use App\Models\Producto;
use App\Models\ProductoLive;
use App\Models\SesionLive;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoLiveSalesSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::where('email', 'vendedor.demo@akinomass.test')->first();
        $canalTikTok = CanalVenta::where('codigo_can', 'tiktok_live')->value('cod_canal_venta');
        $flujoLive = TipoFlujoComercial::where('codigo_tip', 'venta_en_vivo')->value('cod_tipo_flujo_comercial');

        $sesionFinalizada = SesionLive::updateOrCreate(
            ['titulo_ses' => 'Live Demo Equipos Streaming - Abril'],
            [
                'fecha_inicio_ses' => now()->subDays(10)->setTime(19, 0),
                'fecha_fin_ses' => now()->subDays(10)->setTime(20, 30),
                'estado_ses' => EstadoSesionLiveEnum::FINALIZADA->value,
                'resumen_ses' => 'Sesión de demostración finalizada con buena interacción y consultas de kits.',
                'cod_canal_venta' => $canalTikTok,
                'cod_usuario_responsable' => $usuario?->id,
            ],
        );

        $sesionProgramada = SesionLive::updateOrCreate(
            ['titulo_ses' => 'Live Demo Ofertas de Temporada - Mayo'],
            [
                'fecha_inicio_ses' => now()->addDays(2)->setTime(20, 0),
                'fecha_fin_ses' => null,
                'estado_ses' => EstadoSesionLiveEnum::PROGRAMADA->value,
                'resumen_ses' => 'Sesión programada para productos con bajo stock y promociones.',
                'cod_canal_venta' => $canalTikTok,
                'cod_usuario_responsable' => $usuario?->id,
            ],
        );

        $productos = Producto::query()->pluck('cod_producto', 'sku_pro');

        $productosLive = [
            [$sesionFinalizada->cod_sesion_live, 'DEMO-KIT-001', 1, 499],
            [$sesionFinalizada->cod_sesion_live, 'DEMO-AUD-001', 2, 315],
            [$sesionProgramada->cod_sesion_live, 'DEMO-ILU-002', 1, 260],
            [$sesionProgramada->cod_sesion_live, 'DEMO-KIT-002', 2, 850],
        ];

        foreach ($productosLive as [$codSesion, $sku, $orden, $precio]) {
            ProductoLive::updateOrCreate(
                ['cod_sesion_live' => $codSesion, 'cod_producto' => $productos[$sku] ?? null],
                [
                    'orden_proliv' => $orden,
                    'precio_live_proliv' => $precio,
                    'observacion_proliv' => 'Precio promocional demo para live.',
                ],
            );
        }

        $leadLive = Lead::updateOrCreate(
            ['correo_lea' => 'interesada.live.demo@correo.test'],
            [
                'nombre_lea' => 'Camila Arce',
                'alias_lea' => '@camilalive',
                'telefono_lea' => '70999999',
                'producto_interes_lea' => 'Kit streaming básico',
                'observacion_lea' => 'Lead convertido desde interacción en sesión live demo.',
                'estado_lea' => EstadoLeadEnum::CONTACTADO->value,
                'fecha_seguimiento_lea' => now()->addDay()->toDateString(),
                'cod_canal_venta' => $canalTikTok,
                'cod_tipo_flujo_comercial' => $flujoLive,
                'cod_usuario_responsable' => $usuario?->id,
            ],
        );

        $interacciones = [
            ['sesion' => $sesionFinalizada, 'sku' => 'DEMO-KIT-001', 'alias' => '@camilalive', 'nombre' => 'Camila Arce', 'telefono' => '70999999', 'estado' => EstadoInteraccionLiveEnum::CONVERTIDO_LEAD->value, 'lead' => $leadLive->cod_lead, 'obs' => 'Solicitó catálogo y fue convertida a lead.'],
            ['sesion' => $sesionFinalizada, 'sku' => 'DEMO-AUD-001', 'alias' => '@edgarsonido', 'nombre' => 'Edgar Ruiz', 'telefono' => '70121212', 'estado' => EstadoInteraccionLiveEnum::CONTACTADO->value, 'lead' => null, 'obs' => 'Interesado en precio por volumen.'],
            ['sesion' => $sesionProgramada, 'sku' => 'DEMO-ILU-002', 'alias' => '@luzpro', 'nombre' => 'Nadia Flores', 'telefono' => null, 'estado' => EstadoInteraccionLiveEnum::NUEVO->value, 'lead' => null, 'obs' => 'Recordatorio para contactar durante la sesión programada.'],
        ];

        foreach ($interacciones as $interaccion) {
            InteraccionLive::updateOrCreate(
                [
                    'cod_sesion_live' => $interaccion['sesion']->cod_sesion_live,
                    'alias_int' => $interaccion['alias'],
                    'cod_producto' => $productos[$interaccion['sku']] ?? null,
                ],
                [
                    'nombre_int' => $interaccion['nombre'],
                    'telefono_int' => $interaccion['telefono'],
                    'observacion_int' => $interaccion['obs'],
                    'intencion_compra_int' => 'Alta',
                    'estado_int' => $interaccion['estado'],
                    'cod_lead' => $interaccion['lead'],
                    'cod_usuario_responsable' => $usuario?->id,
                ],
            );
        }
    }
}
