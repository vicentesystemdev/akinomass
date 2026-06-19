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
            // Medios de pago - QR
            [
                'clave_cti' => 'pago_qr_imagen',
                'valor_cti' => '',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Ruta de imagen del código QR de la empresa',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_qr_titulo',
                'valor_cti' => 'Escanea el código QR',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Título del método de pago QR',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_qr_instrucciones',
                'valor_cti' => 'Realiza el pago escaneando el código QR y adjunta tu comprobante de transferencia.',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Instrucciones para el pago por QR',
                'activo_cti' => true,
            ],
            // Medios de pago - Transferencia
            [
                'clave_cti' => 'pago_transferencia_banco',
                'valor_cti' => 'Banco de Crédito BCP',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Nombre del banco para transferencia',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_transferencia_cuenta',
                'valor_cti' => '',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Número de cuenta bancaria para transferencia',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_transferencia_titular',
                'valor_cti' => '',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Nombre del titular de la cuenta de transferencia',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_transferencia_cci',
                'valor_cti' => '',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'CCI de la cuenta de transferencia',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_transferencia_imagen',
                'valor_cti' => '',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Ruta de imagen de datos bancarios para transferencia',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_transferencia_instrucciones',
                'valor_cti' => 'Realiza la transferencia al número de cuenta indicado y adjunta tu comprobante.',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Instrucciones para el pago por transferencia',
                'activo_cti' => true,
            ],
            // Medios de pago - Depósito
            [
                'clave_cti' => 'pago_deposito_banco',
                'valor_cti' => 'Banco de Crédito BCP',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Nombre del banco para depósito',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_deposito_cuenta',
                'valor_cti' => '',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Número de cuenta bancaria para depósito',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_deposito_titular',
                'valor_cti' => '',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Nombre del titular de la cuenta de depósito',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_deposito_imagen',
                'valor_cti' => '',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Ruta de imagen de datos bancarios para depósito',
                'activo_cti' => true,
            ],
            [
                'clave_cti' => 'pago_deposito_instrucciones',
                'valor_cti' => 'Realiza el depósito en ventanilla al número de cuenta indicado y adjunta tu comprobante.',
                'tipo_cti' => 'string',
                'descripcion_cti' => 'Instrucciones para el pago por depósito',
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
