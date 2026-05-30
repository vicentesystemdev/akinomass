<?php

namespace App\Domains\Comercial\Pagos\Events;

use App\Models\Pago;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PagoConfirmadoEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Pago $pago,
    ) {}
}
