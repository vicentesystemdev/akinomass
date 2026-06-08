<?php

namespace Database\Seeders\Demo;

use Database\Seeders\CanalesVentaSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\TiposFlujoComercialSeeder;
use Illuminate\Database\Seeder;

class DemoAkinomassSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            CanalesVentaSeeder::class,
            TiposFlujoComercialSeeder::class,
            DemoUsuariosSeeder::class,
            DemoClientesLeadsSeeder::class,
            DemoProductosInventarioSeeder::class,
            DemoPedidosPagosSeeder::class,
            DemoLiveSalesSeeder::class,
            DemoVariantesSeeder::class,
        ]);
    }
}
