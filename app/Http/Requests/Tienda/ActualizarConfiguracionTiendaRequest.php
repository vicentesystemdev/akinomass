<?php

namespace App\Http\Requests\Tienda;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarConfiguracionTiendaRequest extends FormRequest
{
    private const IMAGE_KEYS = [
        'pago_qr_imagen',
        'pago_transferencia_imagen',
        'pago_deposito_imagen',
    ];

    public function authorize(): bool
    {
        return $this->user()?->can('configuracion_tienda.editar') ?? false;
    }

    public function rules(): array
    {
        $imageRules = [];

        foreach (self::IMAGE_KEYS as $key) {
            if ($this->hasFile($key)) {
                $imageRules[$key] = ['file', 'image', 'mimes:jpg,jpeg,png', 'max:2048'];
            } else {
                $imageRules[$key] = ['sometimes', 'nullable', 'string', 'max:255'];
            }
        }

        return array_merge([
            'carrito_reserva_minutos' => ['sometimes', 'integer', 'min:5', 'max:120'],
            'checkout_ttl_minutos' => ['sometimes', 'integer', 'min:10', 'max:180'],
            'checkout_pago_pendiente_minutos' => ['sometimes', 'integer', 'min:10', 'max:1440'],
            'pago_observado_correccion_minutos' => ['sometimes', 'integer', 'min:30', 'max:4320'],
            'pago_rechazado_resubida_minutos' => ['sometimes', 'integer', 'min:30', 'max:4320'],
            'carrito_permitir_extension' => ['sometimes', 'boolean'],
            'carrito_max_extensiones' => ['sometimes', 'integer', 'min:0', 'max:5'],
            // QR
            'pago_qr_titulo' => ['sometimes', 'nullable', 'string', 'max:100'],
            'pago_qr_instrucciones' => ['sometimes', 'nullable', 'string', 'max:500'],
            // Transferencia
            'pago_transferencia_banco' => ['sometimes', 'nullable', 'string', 'max:100'],
            'pago_transferencia_cuenta' => ['sometimes', 'nullable', 'string', 'max:50'],
            'pago_transferencia_titular' => ['sometimes', 'nullable', 'string', 'max:150'],
            'pago_transferencia_cci' => ['sometimes', 'nullable', 'string', 'max:50'],
            'pago_transferencia_instrucciones' => ['sometimes', 'nullable', 'string', 'max:500'],
            // Depósito
            'pago_deposito_banco' => ['sometimes', 'nullable', 'string', 'max:100'],
            'pago_deposito_cuenta' => ['sometimes', 'nullable', 'string', 'max:50'],
            'pago_deposito_titular' => ['sometimes', 'nullable', 'string', 'max:150'],
            'pago_deposito_instrucciones' => ['sometimes', 'nullable', 'string', 'max:500'],
        ], $imageRules);
    }
}
