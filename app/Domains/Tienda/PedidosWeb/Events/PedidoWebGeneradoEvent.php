<?php

namespace App\Domains\Tienda\PedidosWeb\Events;

use App\Models\PedidoTienda;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PedidoWebGeneradoEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public PedidoTienda $pedidoTienda,
    ) {}
}
