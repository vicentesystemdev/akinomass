<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            CanalesVentaSeeder::class,
            TiposFlujoComercialSeeder::class,
            ConfiguracionTiendaSeeder::class,
            PlantillasMensajeSeeder::class,
            TallaProductoSeeder::class,
        ]);
    }
}
