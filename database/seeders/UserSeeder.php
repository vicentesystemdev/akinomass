<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrador AKINOMASS',
                'email' => 'admin@akinomass.com',
                'password' => 'password',
                'role' => 'Administrador',
            ],
            [
                'name' => 'Supervisor Comercial',
                'email' => 'supervisor@akinomass.com',
                'password' => 'password',
                'role' => 'Supervisor Comercial',
            ],
            [
                'name' => 'Vendedor AKINOMASS',
                'email' => 'vendedor@akinomass.com',
                'password' => 'password',
                'role' => 'Vendedor',
            ],
            [
                'name' => 'Encargado de Inventario',
                'email' => 'inventario@akinomass.com',
                'password' => 'password',
                'role' => 'Encargado de Inventario',
            ],
            [
                'name' => 'Encargado de Pedidos',
                'email' => 'pedidos@akinomass.com',
                'password' => 'password',
                'role' => 'Encargado de Pedidos',
            ],
            [
                'name' => 'Analista AKINOMASS',
                'email' => 'analista@akinomass.com',
                'password' => 'password',
                'role' => 'Analista',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                [
                    'email' => $userData['email'],
                ],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                ]
            );

            $role = Role::where('name', $userData['role'])
                ->where('guard_name', 'web')
                ->first();

            if ($role) {
                $user->syncRoles([$role]);
            }
        }
    }
}