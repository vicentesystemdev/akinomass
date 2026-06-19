<?php

namespace Tests\Feature\Tienda;

use App\Models\ConfiguracionTienda;

class ConfiguracionMediosPagoTest extends TiendaTestCase
{
    public function test_qa14_configuracion_pago_qr_existe_por_defecto(): void
    {
        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $qr = ConfiguracionTienda::where('clave_cti', 'pago_qr_titulo')->first();
        $this->assertNotNull($qr);
        $this->assertEquals('Escanea el código QR', $qr->valor_cti);
    }

    public function test_qa15_configuracion_transferencia_existe_por_defecto(): void
    {
        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $banco = ConfiguracionTienda::where('clave_cti', 'pago_transferencia_banco')->first();
        $this->assertNotNull($banco);
        $this->assertEquals('Banco de Crédito BCP', $banco->valor_cti);

        $cuenta = ConfiguracionTienda::where('clave_cti', 'pago_transferencia_cuenta')->first();
        $this->assertNotNull($cuenta);
    }

    public function test_qa16_configuracion_deposito_existe_por_defecto(): void
    {
        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $banco = ConfiguracionTienda::where('clave_cti', 'pago_deposito_banco')->first();
        $this->assertNotNull($banco);
        $this->assertEquals('Banco de Crédito BCP', $banco->valor_cti);
    }

    public function test_qa17_admin_actualiza_datos_bancarios_transferencia(): void
    {
        $admin = \App\Models\User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $response = $this->actingAs($admin)->patchJson('/configuraciones/tienda', [
            'pago_transferencia_banco' => 'BISA',
            'pago_transferencia_cuenta' => '9876543210',
            'pago_transferencia_titular' => 'Akinomass S.R.L.',
            'pago_transferencia_cci' => '000111222333444',
        ]);

        $response->assertStatus(200);

        $this->assertEquals('BISA', ConfiguracionTienda::where('clave_cti', 'pago_transferencia_banco')->first()->valor_cti);
        $this->assertEquals('9876543210', ConfiguracionTienda::where('clave_cti', 'pago_transferencia_cuenta')->first()->valor_cti);
        $this->assertEquals('Akinomass S.R.L.', ConfiguracionTienda::where('clave_cti', 'pago_transferencia_titular')->first()->valor_cti);
        $this->assertEquals('000111222333444', ConfiguracionTienda::where('clave_cti', 'pago_transferencia_cci')->first()->valor_cti);
    }

    public function test_qa18_admin_actualiza_instrucciones_qr(): void
    {
        $admin = \App\Models\User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $response = $this->actingAs($admin)->patchJson('/configuraciones/tienda', [
            'pago_qr_instrucciones' => 'Escanea y paga en menos de 2 minutos.',
        ]);

        $response->assertStatus(200);

        $this->assertEquals(
            'Escanea y paga en menos de 2 minutos.',
            ConfiguracionTienda::where('clave_cti', 'pago_qr_instrucciones')->first()->valor_cti,
        );
    }

    public function test_qa19_usuario_sin_permiso_no_puede_cambiar_config_pago(): void
    {
        $cliente = $this->crearUsuarioCliente();

        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $response = $this->actingAs($cliente)->patchJson('/configuraciones/tienda', [
            'pago_transferencia_banco' => 'BANCO FALSO',
        ]);

        $response->assertStatus(302);
    }

    public function test_qa20_service_obtener_medios_pago_retorna_estructura_correcta(): void
    {
        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $service = new \App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService();
        $medios = $service->obtenerMediosPago();

        $this->assertArrayHasKey('qr', $medios);
        $this->assertArrayHasKey('transferencia', $medios);
        $this->assertArrayHasKey('deposito', $medios);

        $this->assertArrayHasKey('imagen', $medios['qr']);
        $this->assertArrayHasKey('titulo', $medios['qr']);
        $this->assertArrayHasKey('instrucciones', $medios['qr']);

        $this->assertArrayHasKey('banco', $medios['transferencia']);
        $this->assertArrayHasKey('cuenta', $medios['transferencia']);
        $this->assertArrayHasKey('titular', $medios['transferencia']);
        $this->assertArrayHasKey('cci', $medios['transferencia']);
        $this->assertArrayHasKey('imagen', $medios['transferencia']);
        $this->assertArrayHasKey('instrucciones', $medios['transferencia']);

        $this->assertArrayHasKey('banco', $medios['deposito']);
        $this->assertArrayHasKey('cuenta', $medios['deposito']);
        $this->assertArrayHasKey('titular', $medios['deposito']);
        $this->assertArrayHasKey('imagen', $medios['deposito']);
        $this->assertArrayHasKey('instrucciones', $medios['deposito']);
    }

    public function test_qa21_service_obtener_medios_pago_valores_por_defecto(): void
    {
        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $service = new \App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService();
        $medios = $service->obtenerMediosPago();

        $this->assertEquals('Escanea el código QR', $medios['qr']['titulo']);
        $this->assertEquals('Banco de Crédito BCP', $medios['transferencia']['banco']);
        $this->assertEquals('Banco de Crédito BCP', $medios['deposito']['banco']);
        $this->assertEquals('', $medios['qr']['imagen']);
        $this->assertEquals('', $medios['transferencia']['cuenta']);
    }

    public function test_qa22_admin_sube_imagen_qr(): void
    {
        $admin = \App\Models\User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $imagen = $this->crearImagenFake('qr_code.jpg');

        $response = $this->actingAs($admin)->patchJson('/configuraciones/tienda', [
            'pago_qr_imagen' => $imagen,
            'pago_qr_titulo' => 'Escanea y paga',
        ]);

        $response->assertStatus(200);

        $config = ConfiguracionTienda::where('clave_cti', 'pago_qr_imagen')->first();
        $this->assertNotEmpty($config->valor_cti);
        $this->assertStringContainsString('medios_pago/', $config->valor_cti);
        $this->assertStringContainsString('pago_qr_imagen_', $config->valor_cti);

        $this->assertEquals('Escanea y paga', ConfiguracionTienda::where('clave_cti', 'pago_qr_titulo')->first()->valor_cti);
    }

    public function test_qa23_admin_elimina_imagen_qr_con_null(): void
    {
        $admin = \App\Models\User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        ConfiguracionTienda::where('clave_cti', 'pago_qr_imagen')->update([
            'valor_cti' => 'medios_pago/pago_qr_imagen_123_test.jpg',
        ]);

        $response = $this->actingAs($admin)->patchJson('/configuraciones/tienda', [
            'pago_qr_imagen' => null,
        ]);

        $response->assertStatus(200);

        $config = ConfiguracionTienda::where('clave_cti', 'pago_qr_imagen')->first();
        $this->assertEquals('', $config->valor_cti);
    }

    public function test_qa24_admin_actualiza_texto_e_imagen_juntos(): void
    {
        $admin = \App\Models\User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        $imagen = $this->crearImagenFake('datos_bancarios.png');

        $response = $this->actingAs($admin)->patchJson('/configuraciones/tienda', [
            'pago_transferencia_banco' => 'BISA',
            'pago_transferencia_cuenta' => '111222333',
            'pago_transferencia_titular' => 'Akinomass',
            'pago_transferencia_cci' => '999888777',
            'pago_transferencia_instrucciones' => 'Transfiere y adjunta comprobante',
            'pago_transferencia_imagen' => $imagen,
        ]);

        $response->assertStatus(200);

        $this->assertEquals('BISA', ConfiguracionTienda::where('clave_cti', 'pago_transferencia_banco')->first()->valor_cti);
        $this->assertEquals('111222333', ConfiguracionTienda::where('clave_cti', 'pago_transferencia_cuenta')->first()->valor_cti);
        $this->assertEquals('Akinomass', ConfiguracionTienda::where('clave_cti', 'pago_transferencia_titular')->first()->valor_cti);
        $this->assertEquals('999888777', ConfiguracionTienda::where('clave_cti', 'pago_transferencia_cci')->first()->valor_cti);
        $this->assertEquals('Transfiere y adjunta comprobante', ConfiguracionTienda::where('clave_cti', 'pago_transferencia_instrucciones')->first()->valor_cti);

        $configImagen = ConfiguracionTienda::where('clave_cti', 'pago_transferencia_imagen')->first();
        $this->assertNotEmpty($configImagen->valor_cti);
        $this->assertStringContainsString('medios_pago/', $configImagen->valor_cti);
    }

    public function test_qa25_guardar_config_con_imagen_existente_string_no_falla(): void
    {
        $admin = \App\Models\User::factory()->create(['email_verified_at' => now()]);
        $admin->assignRole('Administrador');

        $this->seed(\Database\Seeders\ConfiguracionTiendaSeeder::class);

        ConfiguracionTienda::where('clave_cti', 'pago_qr_imagen')->update([
            'valor_cti' => 'medios_pago/pago_qr_imagen_old.jpg',
        ]);

        $response = $this->actingAs($admin)->patchJson('/configuraciones/tienda', [
            'pago_qr_imagen' => 'medios_pago/pago_qr_imagen_old.jpg',
            'pago_qr_titulo' => 'Nuevo titulo',
        ]);

        $response->assertStatus(200);

        $this->assertEquals('Nuevo titulo', ConfiguracionTienda::where('clave_cti', 'pago_qr_titulo')->first()->valor_cti);
        $this->assertEquals('medios_pago/pago_qr_imagen_old.jpg', ConfiguracionTienda::where('clave_cti', 'pago_qr_imagen')->first()->valor_cti);
    }

    private function crearImagenFake(string $nombre): \Illuminate\Http\UploadedFile
    {
        $directorio = sys_get_temp_dir();
        $ruta = $directorio . '/' . $nombre;
        file_put_contents($ruta, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='));

        return new \Illuminate\Http\UploadedFile($ruta, $nombre, 'image/png', null, true);
    }
}
