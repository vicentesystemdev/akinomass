<?php

namespace App\Domains\Tienda\PagosWeb\Events;

use App\Models\PagoTienda;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PagoWebRegistradoEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public PagoTienda $pagoTienda,
    ) {}
}
