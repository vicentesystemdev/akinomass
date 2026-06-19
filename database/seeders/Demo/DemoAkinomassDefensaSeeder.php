<?php

namespace Database\Seeders\Demo;

use Database\Seeders\CanalesVentaSeeder;
use Database\Seeders\ConfiguracionTiendaSeeder;
use Database\Seeders\InteligenciaVentasDemoSeeder;
use Database\Seeders\PlantillasMensajeSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\TallaProductoSeeder;
use Database\Seeders\TiposFlujoComercialSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class DemoAkinomassDefensaSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Validar entorno local
        if (!app()->environment('local')) {
            $this->command->error('ERROR: Este seeder solo puede ejecutarse en el entorno de desarrollo LOCAL.');
            return;
        }

        // 2. Validar variable de seguridad
        if (env('AKINOMASS_DEMO_DEFENSA_TRUNCATE') !== true && env('AKINOMASS_DEMO_DEFENSA_TRUNCATE') !== 'true') {
            $this->command->error('ERROR: Para ejecutar este seeder, debe configurar AKINOMASS_DEMO_DEFENSA_TRUNCATE=true en su archivo .env.');
            return;
        }

        $this->command->info('==================================================');
        $this->command->info('INICIANDO CARGA DEL DATASET DEMO DE DEFENSA');
        $this->command->info('==================================================');

        // 3. Limpieza de tablas operativas
        $this->command->info('Limpiando tablas operativas...');
        Schema::disableForeignKeyConstraints();

        $tablas = [
            'predicciones_ventas',
            'detalles_factura',
            'facturas',
            'comprobantes_pago_tienda',
            'pagos_tienda',
            'pedidos_tienda',
            'checkout_sesiones',
            'reservas_stock_carrito',
            'detalles_carrito',
            'carritos',
            'direcciones_cliente',
            'cuentas_cliente',
            'venta_red_detalles',
            'ventas_redes',
            'interacciones_live',
            'productos_live',
            'sesiones_live',
            'pagos',
            'detalles_pedido',
            'pedidos',
            'movimientos_inventario',
            'inventarios',
            'variantes_producto',
            'productos',
            'categorias_producto',
            'leads',
            'clientes'
        ];

        foreach ($tablas as $tabla) {
            DB::table($tabla)->truncate();
        }

        // Limpiar usuarios demo creados por este seeder
        User::where('email', 'like', '%@akinomass.test')->delete();
        User::where('email', 'like', '%@demo.akinomass.test')->delete();

        Schema::enableForeignKeyConstraints();
        $this->command->info('Tablas limpiadas exitosamente.');

        // 4. Ejecutar Seeders Base del Sistema
        $this->command->info('Cargando configuraciones base del sistema...');
        $this->call([
            RolesAndPermissionsSeeder::class,
            CanalesVentaSeeder::class,
            TiposFlujoComercialSeeder::class,
            ConfiguracionTiendaSeeder::class,
            PlantillasMensajeSeeder::class,
            TallaProductoSeeder::class,
        ]);

        // 5. Cargar Datos Demo de Defensa
        $this->command->info('Cargando datos demo de defensa...');
        $this->call([
            DemoDefensaUsuariosSeeder::class,
            DemoDefensaCatalogoModaSeeder::class,
            DemoDefensaImagenesProductosSeeder::class,
            DemoDefensaClientesSegmentadosSeeder::class,
            DemoDefensaInventarioRealistaSeeder::class,
            DemoDefensaVentasHistoricasSeeder::class,
            DemoDefensaPagosComprobantesSeeder::class,
            DemoDefensaInteraccionesSocialesSeeder::class,
            DemoDefensaTiendaOnlineSeeder::class,
            DemoDefensaInteligenciaVentasEscenariosSeeder::class,
        ]);

        $this->command->info('==================================================');
        $this->command->info('¡DATASET DEMO DE DEFENSA CARGADO EXITOSAMENTE!');
        $this->command->info('==================================================');
    }
}
