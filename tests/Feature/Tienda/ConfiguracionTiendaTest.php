<?php

namespace Tests\Feature\Tienda;

use App\Models\ConfiguracionTienda;

class ConfiguracionTiendaTest extends TiendaTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        ConfiguracionTienda::create([
            'clave_cti' => 'carrito_reserva_minutos',
            'valor_cti' => '20',
            'tipo_cti' => 'entero',
            'descripcion_cti' => 'Minutos de reserva en carrito',
            'activo_cti' => true,
        ]);

        ConfiguracionTienda::create([
            'clave_cti' => 'checkout_ttl_minutos',
            'valor_cti' => '30',
            'tipo_cti' => 'entero',
            'descripcion_cti' => 'Minutos de TTL del checkout',
            'activo_cti' => true,
        ]);
    }

    public function test_qa11_admin_cambia_tiempo_carrito(): void
    {
        $admin = \App\Models\User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $response = $this->actingAs($admin)->patchJson('/configuraciones/tienda', [
            'carrito_reserva_minutos' => '45',
        ]);

        $response->assertStatus(200);

        $config = ConfiguracionTienda::where('clave_cti', 'carrito_reserva_minutos')->first();
        $this->assertEquals('45', $config->valor_cti);
    }

    public function test_qa12_admin_cambia_tiempo_checkout(): void
    {
        $admin = \App\Models\User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $response = $this->actingAs($admin)->patchJson('/configuraciones/tienda', [
            'checkout_ttl_minutos' => '60',
        ]);

        $response->assertStatus(200);

        $config = ConfiguracionTienda::where('clave_cti', 'checkout_ttl_minutos')->first();
        $this->assertEquals('60', $config->valor_cti);
    }

    public function test_usuario_sin_permiso_no_puede_cambiar_config(): void
    {
        $cliente = $this->crearUsuarioCliente();

        $response = $this->actingAs($cliente)->patchJson('/configuraciones/tienda', [
            'carrito_reserva_minutos' => '45',
        ]);

        $response->assertStatus(302);
    }

    public function test_obtener_configuraciones(): void
    {
        $admin = \App\Models\User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $response = $this->actingAs($admin)->get('/configuraciones/tienda');

        $response->assertStatus(200);
    }
}
