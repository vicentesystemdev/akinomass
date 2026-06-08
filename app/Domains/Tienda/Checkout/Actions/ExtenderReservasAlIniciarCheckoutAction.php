<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Models\CheckoutSesion;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ExtenderReservasAlIniciarCheckoutAction
{
    public function __construct(
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(CheckoutSesion $checkoutSesion, int $ttlMinutos = 50): CheckoutSesion
    {
        return DB::transaction(function () use ($checkoutSesion, $ttlMinutos) {
            if ($checkoutSesion->estado_che !== EstadoCheckoutSesionEnum::INICIADO
                && $checkoutSesion->estado_che !== EstadoCheckoutSesionEnum::DATOS_COMPLETADOS) {
                throw ValidationException::withMessages([
                    'checkout' => ['No se pueden extender reservas en el estado actual.'],
                ]);
            }

            if ($checkoutSesion->cod_carrito && $checkoutSesion->carrito) {
                $this->reservaService->extenderReservasPorCarrito($checkoutSesion->carrito, $ttlMinutos);

                $checkoutSesion->update([
                    'expira_en_che' => now()->addMinutes($ttlMinutos),
                ]);
            }

            return $checkoutSesion->fresh();
        });
    }
}
