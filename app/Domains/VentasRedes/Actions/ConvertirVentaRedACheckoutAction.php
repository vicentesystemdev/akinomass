<?php

namespace App\Domains\VentasRedes\Actions;

use App\Models\VentaRed;
use Illuminate\Validation\ValidationException;

class ConvertirVentaRedACheckoutAction
{
    public function execute(VentaRed $ventaRed): void
    {
        throw ValidationException::withMessages([
            'checkout' => ['La conversion a checkout web requiere cuenta de cliente y carrito publico activo. En esta fase usa conversion a pedido administrativo.'],
        ]);
    }
}
