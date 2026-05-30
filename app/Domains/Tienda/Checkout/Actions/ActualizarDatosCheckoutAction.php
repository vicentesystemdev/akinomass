<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Tienda\Checkout\DTOs\ActualizarDatosCheckoutData;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Models\CheckoutSesion;
use App\Models\DireccionCliente;
use Illuminate\Validation\ValidationException;

class ActualizarDatosCheckoutAction
{
    public function execute(CheckoutSesion $checkoutSesion, ActualizarDatosCheckoutData $data): CheckoutSesion
    {
        $estadosPermitidos = [
            EstadoCheckoutSesionEnum::INICIADO,
            EstadoCheckoutSesionEnum::DATOS_COMPLETADOS,
        ];

        if (!in_array($checkoutSesion->estado_che, $estadosPermitidos)) {
            throw ValidationException::withMessages([
                'checkout' => ['La sesión de checkout no permite actualizar datos en su estado actual.'],
            ]);
        }

        $updateData = [
            'email_contacto_che' => $data->emailContacto,
            'telefono_contacto_che' => $data->telefonoContacto,
            'documento_facturacion_che' => $data->documentoFacturacion,
            'razon_social_che' => $data->razonSocial,
        ];

        if ($data->codDireccionCliente) {
            $direccion = DireccionCliente::where('cod_direccion_cliente', $data->codDireccionCliente)
                ->where('activo_dir', true)
                ->first();

            if ($direccion) {
                $updateData['cod_direccion_cliente'] = $direccion->cod_direccion_cliente;
                $updateData['direccion_entrega_che'] = implode(', ', array_filter([
                    $direccion->direccion_dir,
                    $direccion->ciudad_dir,
                    $direccion->departamento_dir,
                ]));
            }
        } elseif ($data->direccionEntrega) {
            $updateData['direccion_entrega_che'] = $data->direccionEntrega;
        }

        $updateData['estado_che'] = EstadoCheckoutSesionEnum::DATOS_COMPLETADOS;

        $checkoutSesion->update($updateData);

        return $checkoutSesion->fresh();
    }
}
