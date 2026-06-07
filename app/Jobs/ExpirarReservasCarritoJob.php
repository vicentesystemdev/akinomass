<?php

namespace App\Jobs;

use App\Domains\Tienda\Carrito\Actions\ExpirarReservasCarritoAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ExpirarReservasCarritoJob implements ShouldQueue
{
    use Queueable;

    public function handle(ExpirarReservasCarritoAction $action): void
    {
        $action->execute();
    }
}
