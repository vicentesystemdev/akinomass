<?php

namespace Database\Seeders;

use App\Models\TipoFlujoComercial;
use Illuminate\Database\Seeder;

class TiposFlujoComercialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiposFlujo = [
            ['nombre_tip' => 'Venta en vivo', 'codigo_tip' => 'venta_en_vivo'],
            ['nombre_tip' => 'Conversación directa', 'codigo_tip' => 'conversacion_directa'],
            ['nombre_tip' => 'Marketplace', 'codigo_tip' => 'marketplace'],
            ['nombre_tip' => 'Campaña de marketing', 'codigo_tip' => 'campania_marketing'],
            ['nombre_tip' => 'Referido', 'codigo_tip' => 'referido'],
            ['nombre_tip' => 'Venta directa', 'codigo_tip' => 'venta_directa'],
            ['nombre_tip' => 'Otro', 'codigo_tip' => 'otro'],
        ];

        foreach ($tiposFlujo as $tipoFlujo) {
            TipoFlujoComercial::updateOrCreate(
                ['codigo_tip' => $tipoFlujo['codigo_tip']],
                [
                    'nombre_tip' => $tipoFlujo['nombre_tip'],
                    'descripcion_tip' => null,
                    'activo_tip' => true,
                ],
            );
        }
    }
}
