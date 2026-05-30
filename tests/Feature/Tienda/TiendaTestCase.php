<?php

namespace Tests\Feature\Tienda;

use App\Models\CanalVenta;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

abstract class TiendaTestCase extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();

        $this->seed(RolesAndPermissionsSeeder::class);

        CanalVenta::create([
            'nombre_can' => 'Web',
            'codigo_can' => 'web',
            'activo_can' => true,
        ]);

        TipoFlujoComercial::create([
            'nombre_tip' => 'Compra Web',
            'codigo_tip' => 'compra_web',
            'activo_tip' => true,
        ]);
    }

    protected function crearUsuarioCliente(array $attributes = []): User
    {
        $user = User::factory()->create(array_merge([
            'email_verified_at' => now(),
        ], $attributes));

        $user->assignRole('Cliente');

        return $user;
    }
}
