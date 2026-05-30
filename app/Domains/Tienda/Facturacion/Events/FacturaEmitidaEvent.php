<?php

namespace App\Domains\Tienda\Facturacion\Events;

use App\Models\Factura;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FacturaEmitidaEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Factura $factura,
    ) {}
}
