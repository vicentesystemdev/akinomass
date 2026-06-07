<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Models\CheckoutSesion;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CancelarCheckoutLiberandoReservasAction
{
    public function __construct(
        private ReservaStockCarritoService $reservaService,
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
                    'checkout' => ['El checkout no puede ser cancelado en su estado actual.'],
                ]);
            }

            $checkoutSesion->update([
                'estado_che' => EstadoCheckoutSesionEnum::CANCELADO,
            ]);

            if ($checkoutSesion->cod_carrito && $checkoutSesion->carrito) {
                $checkoutSesion->carrito->update([
                    'estado_car' => EstadoCarritoEnum::ABANDONADO,
                ]);

                $this->reservaService->cancelarReservasPorCarrito($checkoutSesion->carrito);
            }

            return $checkoutSesion->fresh();
        });
    }
}
