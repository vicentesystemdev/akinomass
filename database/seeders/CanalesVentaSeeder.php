<?php

namespace Database\Seeders;

use App\Models\CanalVenta;
use Illuminate\Database\Seeder;

class CanalesVentaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $canales = [
            ['nombre_can' => 'TikTok LIVE', 'codigo_can' => 'tiktok_live'],
            ['nombre_can' => 'WhatsApp', 'codigo_can' => 'whatsapp'],
            ['nombre_can' => 'Instagram', 'codigo_can' => 'instagram'],
            ['nombre_can' => 'Facebook', 'codigo_can' => 'facebook'],
            ['nombre_can' => 'Telegram', 'codigo_can' => 'telegram'],
            ['nombre_can' => 'Marketplace', 'codigo_can' => 'marketplace'],
            ['nombre_can' => 'Web', 'codigo_can' => 'web'],
            ['nombre_can' => 'Venta directa', 'codigo_can' => 'venta_directa'],
            ['nombre_can' => 'Otro', 'codigo_can' => 'otro'],
        ];

        foreach ($canales as $canal) {
            CanalVenta::updateOrCreate(
                ['codigo_can' => $canal['codigo_can']],
                [
                    'nombre_can' => $canal['nombre_can'],
                    'descripcion_can' => null,
                    'activo_can' => true,
                ],
            );
        }
    }
}
