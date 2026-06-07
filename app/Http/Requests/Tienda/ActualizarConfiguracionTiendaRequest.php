<?php

namespace App\Http\Requests\Tienda;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarConfiguracionTiendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('configuracion_tienda.editar') ?? false;
    }

    public function rules(): array
    {
        return [
            'carrito_reserva_minutos' => ['sometimes', 'integer', 'min:5', 'max:120'],
            'checkout_ttl_minutos' => ['sometimes', 'integer', 'min:10', 'max:180'],
            'checkout_pago_pendiente_minutos' => ['sometimes', 'integer', 'min:10', 'max:1440'],
            'pago_observado_correccion_minutos' => ['sometimes', 'integer', 'min:30', 'max:4320'],
            'pago_rechazado_resubida_minutos' => ['sometimes', 'integer', 'min:30', 'max:4320'],
            'carrito_permitir_extension' => ['sometimes', 'boolean'],
            'carrito_max_extensiones' => ['sometimes', 'integer', 'min:0', 'max:5'],
        ];
    }
}
