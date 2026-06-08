<?php

namespace App\Domains\Tienda\PagosWeb\Events;

use App\Models\PedidoTienda;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StockPedidoWebDescontadoEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public PedidoTienda $pedidoTienda,
    ) {}
}
