<?php

namespace Database\Seeders\Demo;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUsuariosSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = [
            ['name' => 'Alejandro Siles', 'email' => 'admin@akinomass.local', 'rol' => 'Administrador'],
            ['name' => 'Gabriela Quiroga', 'email' => 'supervisor@akinomass.local', 'rol' => 'Supervisor Comercial'],
            ['name' => 'Beto Fernández', 'email' => 'vendedor@akinomass.local', 'rol' => 'Vendedor'],
            ['name' => 'Carlos Mamani', 'email' => 'inventario@akinomass.local', 'rol' => 'Encargado de Inventario'],
            ['name' => 'Daniela Flores', 'email' => 'pedidos@akinomass.local', 'rol' => 'Encargado de Pedidos'],
            ['name' => 'Elena Choque', 'email' => 'analista@akinomass.local', 'rol' => 'Analista'],
        ];

        foreach ($usuarios as $usuarioData) {
            $user = User::updateOrCreate(
                ['email' => $usuarioData['email']],
                [
                    'name' => $usuarioData['name'],
                    'password' => Hash::make('password'),
                ],
            );

            $user->syncRoles([$usuarioData['rol']]);
        }
    }
}
