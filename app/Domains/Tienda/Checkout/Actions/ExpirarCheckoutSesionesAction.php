<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Models\CheckoutSesion;
use Illuminate\Support\Facades\DB;

class ExpirarCheckoutSesionesAction
{
    public function __construct(
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(): int
    {
        return DB::transaction(function () {
            $sesionesExpiradas = CheckoutSesion::whereIn('estado_che', [
                EstadoCheckoutSesionEnum::INICIADO,
                EstadoCheckoutSesionEnum::DATOS_COMPLETADOS,
            ])
            ->where('expira_en_che', '<=', now())
            ->lockForUpdate()
            ->get();

            $contador = 0;

            foreach ($sesionesExpiradas as $sesion) {
                $sesion->update([
                    'estado_che' => EstadoCheckoutSesionEnum::EXPIRADO,
                ]);

                if ($sesion->cod_carrito && $sesion->carrito) {
                    $sesion->carrito->update([
                        'estado_car' => EstadoCarritoEnum::EXPIRADO,
                    ]);

                    $this->reservaService->cancelarReservasPorCarrito($sesion->carrito);
                }

                $contador++;
            }

            return $contador;
        });
    }
}
