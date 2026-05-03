<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Seed roles and permissions.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'clientes.ver',
            'clientes.crear',
            'clientes.editar',
            'clientes.eliminar',
            'leads.ver',
            'leads.crear',
            'leads.editar',
            'leads.convertir',
            'leads.eliminar',
            'productos.ver',
            'productos.crear',
            'productos.editar',
            'productos.eliminar',
            'inventario.ver',
            'inventario.ajustar',
            'inventario.movimientos',
            'pedidos.ver',
            'pedidos.crear',
            'pedidos.editar',
            'pedidos.confirmar',
            'pedidos.cancelar',
            'pagos.ver',
            'pagos.registrar',
            'pagos.confirmar',
            'pagos.rechazar',
            'reportes.ver',
            'dashboard.ver',
            'usuarios.ver',
            'usuarios.crear',
            'usuarios.editar',
            'usuarios.eliminar',
            'roles.ver',
            'roles.crear',
            'roles.editar',
            'roles.asignar',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $roles = [
            'Administrador' => $permissions,
            'Supervisor Comercial' => [
                'clientes.ver',
                'clientes.crear',
                'clientes.editar',
                'leads.ver',
                'leads.crear',
                'leads.editar',
                'leads.convertir',
                'pedidos.ver',
                'pedidos.crear',
                'pedidos.editar',
                'pedidos.confirmar',
                'pedidos.cancelar',
                'pagos.ver',
                'pagos.registrar',
                'pagos.confirmar',
                'pagos.rechazar',
                'reportes.ver',
                'dashboard.ver',
            ],
            'Vendedor' => [
                'clientes.ver',
                'clientes.crear',
                'clientes.editar',
                'leads.ver',
                'leads.crear',
                'leads.editar',
                'leads.convertir',
                'pedidos.ver',
                'pedidos.crear',
                'pagos.ver',
            ],
            'Encargado de Inventario' => [
                'productos.ver',
                'productos.crear',
                'productos.editar',
                'inventario.ver',
                'inventario.ajustar',
                'inventario.movimientos',
                'dashboard.ver',
            ],
            'Encargado de Pedidos' => [
                'clientes.ver',
                'pedidos.ver',
                'pedidos.editar',
                'pedidos.confirmar',
                'pedidos.cancelar',
                'pagos.ver',
                'productos.ver',
                'inventario.ver',
                'dashboard.ver',
            ],
            'Analista' => [
                'clientes.ver',
                'leads.ver',
                'productos.ver',
                'inventario.ver',
                'pedidos.ver',
                'pagos.ver',
                'reportes.ver',
                'dashboard.ver',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions($rolePermissions);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
