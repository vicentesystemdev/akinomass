<?php

namespace App\Domains\Tienda\Facturacion\Actions;

use App\Domains\Tienda\Facturacion\Enums\EstadoFacturaEnum;
use App\Models\Factura;
use Illuminate\Validation\ValidationException;

class AnularFacturaAction
{
    public function execute(Factura $factura): Factura
    {
        if ($factura->estado_fac === EstadoFacturaEnum::ANULADA) {
            throw ValidationException::withMessages([
                'factura' => ['La factura ya está anulada.'],
            ]);
        }

        $factura->update([
            'estado_fac' => EstadoFacturaEnum::ANULADA,
            'anulada_en_fac' => now(),
        ]);

        return $factura->fresh();
    }
}
