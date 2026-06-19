<?php

namespace Tests\Feature;

use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RolesAndPermissionsSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_encargado_de_pedidos_conserva_permisos_administrativos_y_de_tienda(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $role = Role::findByName('Encargado de Pedidos', 'web');

        $expectedPermissions = [
            'clientes.ver',
            'pedidos.ver',
            'pedidos.editar',
            'pedidos.confirmar',
            'pedidos.cancelar',
            'pagos.ver',
            'productos.ver',
            'inventario.ver',
            'dashboard.ver',
            'pedidos_tienda.revisar',
            'pedidos_tienda.aceptar',
            'pedidos_tienda.rechazar',
            'pagos_tienda.revisar',
            'pagos_tienda.aceptar',
            'pagos_tienda.observar',
            'pagos_tienda.rechazar',
        ];

        $this->assertEqualsCanonicalizing(
            $expectedPermissions,
            $role->permissions()->pluck('name')->all(),
        );
    }
}
