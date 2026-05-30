<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Models\CheckoutSesion;

class ExpirarCheckoutSesionesAction
{
    public function execute(): int
    {
        $sesionesExpiradas = CheckoutSesion::whereIn('estado_che', [
            EstadoCheckoutSesionEnum::INICIADO,
            EstadoCheckoutSesionEnum::DATOS_COMPLETADOS,
        ])
        ->where('expira_en_che', '<=', now())
        ->get();

        $contador = 0;

        foreach ($sesionesExpiradas as $sesion) {
            $sesion->update([
                'estado_che' => EstadoCheckoutSesionEnum::EXPIRADO,
            ]);

            if ($sesion->cod_carrito && $sesion->carrito) {
                $sesion->carrito->update([
                    'estado_car' => EstadoCarritoEnum::ACTIVO,
                ]);
            }

            $contador++;
        }

        return $contador;
    }
}
