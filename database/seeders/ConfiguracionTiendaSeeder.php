<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ConfiguracionTienda;

class ConfiguracionTiendaSeeder extends Seeder
{
    public function run(): void
    {
        $configuraciones = [
            [
                'clave_cti' => 'carrito_reserva_minutos',
                'valor_cti' => '20',
                'tipo_cti' => 'integer',
                'descripcion_cti' => 'Tiempo de reserva en carrito (minutos)',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'checkout_ttl_minutos',
                'valor_cti' => '30',
                'tipo_cti' => 'integer',
                'descripcion_cti' => 'Tiempo máximo para completar checkout (minutos)',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'checkout_pago_pendiente_minutos',
                'valor_cti' => '60',
                'tipo_cti' => 'integer',
                'descripcion_cti' => 'Tiempo para subir comprobante de pago (minutos)',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_observado_correccion_minutos',
                'valor_cti' => '1440',
                'tipo_cti' => 'integer',
                'descripcion_cti' => 'Tiempo para corregir pago observado (minutos)',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_rechazado_resubida_minutos',
                'valor_cti' => '1440',
                'tipo_cti' => 'integer',
                'descripcion_cti' => 'Tiempo para resubir pago rechazado (minutos)',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'carrito_permitir_extension',
                'valor_cti' => 'true',
                'tipo_cti' => 'boolean',
                'descripcion_cti' => 'Permite extender reserva de carrito',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'carrito_max_extensiones',
                'valor_cti' => '1',
                'tipo_cti' => 'integer',
                'descripcion_cti' => 'Máximo de extensiones de reserva',
                'activo_cti' => true,
            ],
        ];

        foreach ($configuraciones as $config) {
            ConfiguracionTienda::updateOrCreate(
                ['clave_cti' => $config['clave_cti']],
                $config,
            );
        }
    }
}
