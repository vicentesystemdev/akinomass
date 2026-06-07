<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\Checkout\Services\CheckoutService;
use App\Models\CheckoutSesion;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VolverAlCarritoDesdeCheckoutAction
{
    public function __construct(
        private CheckoutService $checkoutService,
    ) {}

    public function execute(CheckoutSesion $checkoutSesion): CheckoutSesion
    {
        return DB::transaction(function () use ($checkoutSesion) {
            $estadosPermitidos = [
                EstadoCheckoutSesionEnum::INICIADO,
                EstadoCheckoutSesionEnum::DATOS_COMPLETADOS,
            ];

            if (!in_array($checkoutSesion->estado_che, $estadosPermitidos)) {
                throw ValidationException::withMessages([
                    'checkout' => ['No se puede volver al carrito en el estado actual del checkout.'],
                ]);
            }

            if ($checkoutSesion->cod_carrito && $checkoutSesion->carrito) {
                $checkoutSesion->carrito->update([
                    'estado_car' => EstadoCarritoEnum::ACTIVO,
                ]);
            }

            return $checkoutSesion->fresh();
        });
    }
}
