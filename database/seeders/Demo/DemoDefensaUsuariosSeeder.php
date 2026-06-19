<?php

namespace Database\Seeders\Demo;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDefensaUsuariosSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = [
            [
                'name' => 'Admin Akinomass',
                'email' => 'admin@akinomass.test',
                'rol' => 'Administrador'
            ],
            [
                'name' => 'Supervisor Comercial Demo',
                'email' => 'supervisor@akinomass.test',
                'rol' => 'Supervisor Comercial'
            ],
            [
                'name' => 'Vendedor Demo',
                'email' => 'vendedor@akinomass.test',
                'rol' => 'Vendedor'
            ],
            [
                'name' => 'Encargado de Inventario Demo',
                'email' => 'inventario@akinomass.test',
                'rol' => 'Encargado de Inventario'
            ],
            [
                'name' => 'Encargado de Pedidos Demo',
                'email' => 'pedidos@akinomass.test',
                'rol' => 'Encargado de Pedidos'
            ],
            [
                'name' => 'Analista Demo',
                'email' => 'analista@akinomass.test',
                'rol' => 'Analista'
            ],
            [
                'name' => 'Cliente Demo',
                'email' => 'cliente.demo@akinomass.test',
                'rol' => 'Cliente'
            ],
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
