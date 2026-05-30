<?php

namespace Tests\Feature\Tienda;

use App\Models\User;

class AuthClienteTest extends TiendaTestCase
{
    public function test_pagina_registro_accesible(): void
    {
        $response = $this->get('/tienda/registro');

        $response->assertStatus(200);
    }

    public function test_pagina_login_accesible(): void
    {
        $response = $this->get('/tienda/login');

        $response->assertStatus(200);
    }

    public function test_registro_crea_usuario_con_rol_cliente(): void
    {
        $response = $this->post('/tienda/registro', [
            'name' => 'Test Cliente',
            'email' => 'cliente@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'telefono_cli' => '78901234',
        ]);

        $response->assertRedirect('/tienda');

        $user = User::where('email', 'cliente@test.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('Cliente'));
    }

    public function test_login_cliente_redirige_a_tienda(): void
    {
        $user = $this->crearUsuarioCliente();

        $response = $this->post('/tienda/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect('/tienda');
    }

    public function test_registro_email_duplicado_falla(): void
    {
        User::factory()->create(['email' => 'test@test.com']);

        $response = $this->post('/tienda/registro', [
            'name' => 'Test',
            'email' => 'test@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
    }
}
