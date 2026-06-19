<?php

namespace Database\Seeders\Demo;

use App\Models\CanalVenta;
use App\Models\InteraccionLive;
use App\Models\Lead;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\ProductoLive;
use App\Models\SesionLive;
use App\Models\User;
use App\Domains\Comercial\LiveSales\Enums\EstadoSesionLiveEnum;
use App\Domains\Comercial\LiveSales\Enums\EstadoInteraccionLiveEnum;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DemoDefensaInteraccionesSocialesSeeder extends Seeder
{
    public function run(): void
    {
        $vendedor = User::role('Vendedor')->first();
        $vendedorId = $vendedor?->id ?? User::first()?->id;

        $canalTikTok = CanalVenta::where('codigo_can', 'tiktok_live')->value('cod_canal_venta');
        if (!$canalTikTok) {
            $canalTikTok = CanalVenta::first()?->cod_canal_venta;
        }

        $productos = Producto::all();
        $leads = Lead::all();
        $pedidos = Pedido::all();

        $this->command->info('Creando 100 sesiones de live y 1200 interacciones sociales...');

        // Generar 100 sesiones de Live distribuidas en el año
        $sesiones = [];
        for ($i = 1; $i <= 100; $i++) {
            $fechaInicio = Carbon::parse('2025-07-05')->addDays($i * 3)->setTime(19, 0);
            if ($fechaInicio->isAfter(Carbon::parse('2026-06-19'))) {
                $fechaInicio = Carbon::parse('2026-06-15 19:00:00');
            }
            $fechaFin = (clone $fechaInicio)->addMinutes(rand(90, 150));

            $estado = EstadoSesionLiveEnum::FINALIZADA->value;
            // La última sesión puede estar programada para el futuro (después de 2026-06-19)
            if ($i === 100) {
                $estado = EstadoSesionLiveEnum::PROGRAMADA->value;
                $fechaInicio = Carbon::parse('2026-06-21 20:00:00');
                $fechaFin = null;
            }

            $titulo = "Live Colección Moda - Edición #{$i}";
            $sesion = SesionLive::create([
                'titulo_ses' => $titulo,
                'fecha_inicio_ses' => $fechaInicio,
                'fecha_fin_ses' => $fechaFin,
                'estado_ses' => $estado,
                'resumen_ses' => "Transmisión en vivo #{$i} mostrando nuevos ingresos de temporada y jeans cargo.",
                'cod_canal_venta' => $canalTikTok,
                'cod_usuario_responsable' => $vendedorId,
            ]);

            $sesion->created_at = $fechaInicio;
            $sesion->save();
            $sesiones[] = $sesion;

            // Asociar 2-3 productos destacados a cada Live
            $productosDestacados = $productos->random(min(3, $productos->count()));
            $orden = 1;
            foreach ($productosDestacados as $prod) {
                ProductoLive::create([
                    'cod_sesion_live' => $sesion->cod_sesion_live,
                    'cod_producto' => $prod->cod_producto,
                    'orden_proliv' => $orden++,
                    'precio_live_proliv' => $prod->precio_venta_pro * 0.9, // 10% descuento en live
                    'observacion_proliv' => 'Precio promocional exclusivo de transmisión.',
                ]);
            }
        }

        // Generar 1200 interacciones sociales distribuidas
        // Vinculadas a las sesiones de live finalizadas de forma cíclica
        $estadosInt = [
            EstadoInteraccionLiveEnum::NUEVO->value,
            EstadoInteraccionLiveEnum::CONTACTADO->value,
            EstadoInteraccionLiveEnum::CONVERTIDO_LEAD->value,
            EstadoInteraccionLiveEnum::CONVERTIDO_PEDIDO->value,
            EstadoInteraccionLiveEnum::DESCARTADO->value,
        ];

        $comentarios = [
            '¿Qué precio tiene en jeans cargo?',
            '¿Tienen envíos a Sopocachi?',
            'Quiero reservar la polera oversize negra en M.',
            '¿Tienen talla 32 del jean celeste?',
            '¿Aceptan pago por código QR?',
            'Excelente prenda, muy recomendada.',
            'Quiero catálogo por favor.',
            '¿Dónde queda su tienda física?',
            'Reservado el vestido floreado en S.',
            '¿Qué colores tienen disponibles en blusas?',
        ];

        $totalInteracciones = 1200;
        for ($i = 1; $i <= $totalInteracciones; $i++) {
            $sesion = $sesiones[($i * 7) % 99]; // Usar las primeras 99 que están finalizadas
            $producto = $productos->values()->get(($i * 11) % $productos->count());
            $estado = $estadosInt[($i * 13) % count($estadosInt)];

            $lead = null;
            $pedido = null;

            // Vincular de forma determinista con leads y pedidos para simular flujo completo
            if ($estado === EstadoInteraccionLiveEnum::CONVERTIDO_LEAD->value && $leads->isNotEmpty()) {
                $lead = $leads->values()->get(($i * 3) % $leads->count());
            } elseif ($estado === EstadoInteraccionLiveEnum::CONVERTIDO_PEDIDO->value && $pedidos->isNotEmpty()) {
                $pedido = $pedidos->values()->get(($i * 5) % $pedidos->count());
                // Asegurar que si hay pedido, también podemos enlazar su lead si existe
                $lead = $pedido->lead ?? ($leads->isNotEmpty() ? $leads->values()->get(($i * 3) % $leads->count()) : null);
            }

            $alias = '@tiktok_user_' . $i;
            $nombre = 'Usuario Ficticio ' . $i;
            $telefono = rand(1, 100) > 40 ? '7' . rand(1000000, 9999999) : null;

            $interaccion = InteraccionLive::create([
                'cod_sesion_live' => $sesion->cod_sesion_live,
                'cod_producto' => $producto->cod_producto,
                'alias_int' => $alias,
                'nombre_int' => $nombre,
                'telefono_int' => $telefono,
                'observacion_int' => $comentarios[$i % count($comentarios)],
                'intencion_compra_int' => rand(1, 100) > 50 ? 'Alta' : 'Media',
                'estado_int' => $estado,
                'cod_lead' => $lead?->cod_lead,
                'cod_pedido' => $pedido?->cod_pedido,
                'cod_usuario_responsable' => $vendedorId,
            ]);

            $interaccion->created_at = $sesion->created_at->copy()->addMinutes(rand(5, 85));
            $interaccion->save();
        }
    }
}
