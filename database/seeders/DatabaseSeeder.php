<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Database\Seeders\PlantillasMensajeSeeder;
use Database\Seeders\TallaProductoSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PlantillasMensajeSeeder::class,
            RolesAndPermissionsSeeder::class,
            CanalesVentaSeeder::class,
            TiposFlujoComercialSeeder::class,
            TallaProductoSeeder::class,
            ConfiguracionTiendaSeeder::class,
        ]);

        // User::factory(10)->create();

    }
}
