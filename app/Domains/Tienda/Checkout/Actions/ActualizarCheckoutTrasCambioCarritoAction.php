<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\Checkout\Services\CheckoutService;
use App\Models\CheckoutSesion;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ActualizarCheckoutTrasCambioCarritoAction
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
                    'checkout' => ['No se puede actualizar el checkout en su estado actual.'],
                ]);
            }

            if (!$checkoutSesion->cod_carrito || !$checkoutSesion->carrito) {
                throw ValidationException::withMessages([
                    'checkout' => ['El carrito asociado no está disponible.'],
                ]);
            }

            if ($checkoutSesion->carrito->detalles()->count() === 0) {
                throw ValidationException::withMessages([
                    'checkout' => ['El carrito está vacío. No se puede continuar con el checkout.'],
                ]);
            }

            $totales = $this->checkoutService->calcularTotales($checkoutSesion->carrito);

            $checkoutSesion->update([
                'subtotal_che' => $totales['subtotal'],
                'descuento_che' => $totales['descuento'],
                'impuesto_che' => $totales['impuesto'],
                'total_che' => $totales['total'],
            ]);

            return $checkoutSesion->fresh();
        });
    }
}
