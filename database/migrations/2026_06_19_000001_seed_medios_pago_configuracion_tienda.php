<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\ConfiguracionTienda;

return new class extends Migration
{
    public function up(): void
    {
        $mediosPago = [
            // QR
            ['clave_cti' => 'pago_qr_imagen', 'valor_cti' => '', 'tipo_cti' => 'string', 'descripcion_cti' => 'Ruta de imagen del código QR de la empresa'],
            ['clave_cti' => 'pago_qr_titulo', 'valor_cti' => 'Escanea el código QR', 'tipo_cti' => 'string', 'descripcion_cti' => 'Título del método de pago QR'],
            ['clave_cti' => 'pago_qr_instrucciones', 'valor_cti' => 'Realiza el pago escaneando el código QR y adjunta tu comprobante de transferencia.', 'tipo_cti' => 'string', 'descripcion_cti' => 'Instrucciones para el pago por QR'],
            // Transferencia
            ['clave_cti' => 'pago_transferencia_banco', 'valor_cti' => 'Banco de Crédito BCP', 'tipo_cti' => 'string', 'descripcion_cti' => 'Nombre del banco para transferencia'],
            ['clave_cti' => 'pago_transferencia_cuenta', 'valor_cti' => '', 'tipo_cti' => 'string', 'descripcion_cti' => 'Número de cuenta bancaria para transferencia'],
            ['clave_cti' => 'pago_transferencia_titular', 'valor_cti' => '', 'tipo_cti' => 'string', 'descripcion_cti' => 'Nombre del titular de la cuenta de transferencia'],
            ['clave_cti' => 'pago_transferencia_cci', 'valor_cti' => '', 'tipo_cti' => 'string', 'descripcion_cti' => 'CCI de la cuenta de transferencia'],
            ['clave_cti' => 'pago_transferencia_imagen', 'valor_cti' => '', 'tipo_cti' => 'string', 'descripcion_cti' => 'Ruta de imagen de datos bancarios para transferencia'],
            ['clave_cti' => 'pago_transferencia_instrucciones', 'valor_cti' => 'Realiza la transferencia al número de cuenta indicado y adjunta tu comprobante.', 'tipo_cti' => 'string', 'descripcion_cti' => 'Instrucciones para el pago por transferencia'],
            // Depósito
            ['clave_cti' => 'pago_deposito_banco', 'valor_cti' => 'Banco de Crédito BCP', 'tipo_cti' => 'string', 'descripcion_cti' => 'Nombre del banco para depósito'],
            ['clave_cti' => 'pago_deposito_cuenta', 'valor_cti' => '', 'tipo_cti' => 'string', 'descripcion_cti' => 'Número de cuenta bancaria para depósito'],
            ['clave_cti' => 'pago_deposito_titular', 'valor_cti' => '', 'tipo_cti' => 'string', 'descripcion_cti' => 'Nombre del titular de la cuenta de depósito'],
            ['clave_cti' => 'pago_deposito_imagen', 'valor_cti' => '', 'tipo_cti' => 'string', 'descripcion_cti' => 'Ruta de imagen de datos bancarios para depósito'],
            ['clave_cti' => 'pago_deposito_instrucciones', 'valor_cti' => 'Realiza el depósito en ventanilla al número de cuenta indicado y adjunta tu comprobante.', 'tipo_cti' => 'string', 'descripcion_cti' => 'Instrucciones para el pago por depósito'],
        ];

        foreach ($mediosPago as $config) {
            ConfiguracionTienda::updateOrCreate(
                ['clave_cti' => $config['clave_cti']],
                array_merge($config, ['activo_cti' => true]),
            );
        }
    }

    public function down(): void
    {
        $claves = [
            'pago_qr_imagen', 'pago_qr_titulo', 'pago_qr_instrucciones',
            'pago_transferencia_banco', 'pago_transferencia_cuenta', 'pago_transferencia_titular',
            'pago_transferencia_cci', 'pago_transferencia_imagen', 'pago_transferencia_instrucciones',
            'pago_deposito_banco', 'pago_deposito_cuenta', 'pago_deposito_titular',
            'pago_deposito_imagen', 'pago_deposito_instrucciones',
        ];

        ConfiguracionTienda::whereIn('clave_cti', $claves)->delete();
    }
};
