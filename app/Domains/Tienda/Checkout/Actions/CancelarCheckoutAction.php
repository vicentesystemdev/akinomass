<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Models\CheckoutSesion;
use Illuminate\Validation\ValidationException;

class CancelarCheckoutAction
{
    public function execute(CheckoutSesion $checkoutSesion): CheckoutSesion
    {
        $estadosPermitidos = [
            EstadoCheckoutSesionEnum::INICIADO,
            EstadoCheckoutSesionEnum::DATOS_COMPLETADOS,
        ];

        if (!in_array($checkoutSesion->estado_che, $estadosPermitidos)) {
            throw ValidationException::withMessages([
                'checkout' => ['La sesión de checkout no puede ser cancelada en su estado actual.'],
            ]);
        }

        $checkoutSesion->update([
            'estado_che' => EstadoCheckoutSesionEnum::CANCELADO,
        ]);

        if ($checkoutSesion->cod_carrito) {
            $checkoutSesion->carrito->update([
                'estado_car' => EstadoCarritoEnum::ACTIVO,
            ]);
        }

        return $checkoutSesion->fresh();
    }
}
