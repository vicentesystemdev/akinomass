<?php

namespace App\Domains\Tienda\PagosWeb\Events;

use App\Models\Pago;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PagoTiendaAceptadoEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Pago $pago,
    ) {}
}
