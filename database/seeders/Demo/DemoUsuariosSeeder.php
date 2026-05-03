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
            ['name' => 'Administrador Demo', 'email' => 'admin.demo@akinomass.test', 'rol' => 'Administrador'],
            ['name' => 'Supervisor Comercial Demo', 'email' => 'supervisor.demo@akinomass.test', 'rol' => 'Supervisor Comercial'],
            ['name' => 'Vendedor Demo', 'email' => 'vendedor.demo@akinomass.test', 'rol' => 'Vendedor'],
            ['name' => 'Encargado Inventario Demo', 'email' => 'inventario.demo@akinomass.test', 'rol' => 'Encargado de Inventario'],
            ['name' => 'Analista Demo', 'email' => 'analista.demo@akinomass.test', 'rol' => 'Analista'],
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
