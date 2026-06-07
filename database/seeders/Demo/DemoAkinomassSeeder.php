<?php

namespace Database\Seeders\Demo;

use Database\Seeders\CanalesVentaSeeder;
use Database\Seeders\ConfiguracionTiendaSeeder;
use Database\Seeders\InteligenciaVentasDemoSeeder;
use Database\Seeders\PlantillasMensajeSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\TallaProductoSeeder;
use Database\Seeders\TiposFlujoComercialSeeder;
use Illuminate\Database\Seeder;

class DemoAkinomassSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Seeders base del sistema
            RolesAndPermissionsSeeder::class,
            CanalesVentaSeeder::class,
            TiposFlujoComercialSeeder::class,
            ConfiguracionTiendaSeeder::class,
            PlantillasMensajeSeeder::class,
            TallaProductoSeeder::class,

            // Seeders demo
            DemoUsuariosSeeder::class,
            DemoClientesLeadsSeeder::class,
            DemoProductosInventarioSeeder::class,
            DemoVariantesSeeder::class,
            DemoLiveSalesSeeder::class,
            DemoPedidosPagosSeeder::class,

            // Seeder demo de inteligencia/reportes
            InteligenciaVentasDemoSeeder::class,
        ]);
    }
}