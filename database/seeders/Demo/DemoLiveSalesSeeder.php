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
        $usuario = User::where('email', 'vendedor@akinomass.local')->first();
        $canalTikTok = CanalVenta::where('codigo_can', 'tiktok_live')->value('cod_canal_venta');
        $flujoLive = TipoFlujoComercial::where('codigo_tip', 'venta_en_vivo')->value('cod_tipo_flujo_comercial');

        $sesionFinalizada = SesionLive::updateOrCreate(
            ['titulo_ses' => 'Live Colección Otoño/Invierno - AKI NO MASS'],
            [
                'fecha_inicio_ses' => now()->subDays(10)->setTime(19, 0),
                'fecha_fin_ses' => now()->subDays(10)->setTime(20, 30),
                'estado_ses' => EstadoSesionLiveEnum::FINALIZADA->value,
                'resumen_ses' => 'Presentación de nuevas chamarras y vestidos de temporada. Excelente interacción y consultas.',
                'cod_canal_venta' => $canalTikTok,
                'cod_usuario_responsable' => $usuario?->id,
            ],
        );

        $sesionProgramada = SesionLive::updateOrCreate(
            ['titulo_ses' => 'Live Liquidación de Stock de Temporada'],
            [
                'fecha_inicio_ses' => now()->addDays(2)->setTime(20, 0),
                'fecha_fin_ses' => null,
                'estado_ses' => EstadoSesionLiveEnum::PROGRAMADA->value,
                'resumen_ses' => 'Transmisión especial para liquidación de jeans mom fit y poleras básicas.',
                'cod_canal_venta' => $canalTikTok,
                'cod_usuario_responsable' => $usuario?->id,
            ],
        );

        $productos = Producto::query()->pluck('cod_producto', 'sku_pro');

        $productosLive = [
            [$sesionFinalizada->cod_sesion_live, 'ROPA-VES-005', 1, 160], // Vestido Casual Floreado
            [$sesionFinalizada->cod_sesion_live, 'ROPA-CHA-004', 2, 200], // Chamarra Jean Clásica
            [$sesionProgramada->cod_sesion_live, 'ROPA-JEA-002', 1, 180], // Jean Mom Fit Azul
            [$sesionProgramada->cod_sesion_live, 'ROPA-POL-001', 2, 75],  // Polera Oversize Básica
        ];

        foreach ($productosLive as [$codSesion, $sku, $orden, $precio]) {
            ProductoLive::updateOrCreate(
                ['cod_sesion_live' => $codSesion, 'cod_producto' => $productos[$sku] ?? null],
                [
                    'orden_proliv' => $orden,
                    'precio_live_proliv' => $precio,
                    'observacion_proliv' => 'Precio especial promocional exclusivo para Live.',
                ],
            );
        }

        $leadLive = Lead::updateOrCreate(
            ['correo_lea' => 'camila.arce@akinomass.local'],
            [
                'nombre_lea' => 'Camila Arce Prado',
                'alias_lea' => '@camila_ap',
                'telefono_lea' => '70999999',
                'producto_interes_lea' => 'Vestido Casual Floreado',
                'observacion_lea' => 'Lead de WhatsApp convertido desde interacciones en el Live de Otoño.',
                'estado_lea' => EstadoLeadEnum::INTERESADO->value,
                'fecha_seguimiento_lea' => now()->addDay()->toDateString(),
                'cod_canal_venta' => $canalTikTok,
                'cod_tipo_flujo_comercial' => $flujoLive,
                'cod_usuario_responsable' => $usuario?->id,
            ],
        );

        $interacciones = [
            ['sesion' => $sesionFinalizada, 'sku' => 'ROPA-VES-005', 'alias' => '@camila_ap', 'nombre' => 'Camila Arce Prado', 'telefono' => '70999999', 'estado' => EstadoInteraccionLiveEnum::CONVERTIDO_LEAD->value, 'lead' => $leadLive->cod_lead, 'obs' => 'Pidió talla S del Vestido Floreado. Convertida a Lead.'],
            ['sesion' => $sesionFinalizada, 'sku' => 'ROPA-CHA-004', 'alias' => '@edgar_ruiz', 'nombre' => 'Edgar Ruiz', 'telefono' => '71212121', 'estado' => EstadoInteraccionLiveEnum::CONTACTADO->value, 'lead' => null, 'obs' => 'Preguntó por tallas L en Chamarra Jean.'],
            ['sesion' => $sesionProgramada, 'sku' => 'ROPA-JEA-002', 'alias' => '@nadia_f', 'nombre' => 'Nadia Flores', 'telefono' => null, 'estado' => EstadoInteraccionLiveEnum::NUEVO->value, 'lead' => null, 'obs' => 'Dejó comentario indicando que se unirá a la transmisión.'],
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
