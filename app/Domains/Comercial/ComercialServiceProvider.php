<?php

namespace App\Domains\Comercial;

use App\Domains\Comercial\Pagos\Events\PagoConfirmadoEvent;
use App\Domains\Comercial\Pagos\Listeners\ConfirmarPedidoTrasPagoAdminListener;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class ComercialServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Event::listen(PagoConfirmadoEvent::class, ConfirmarPedidoTrasPagoAdminListener::class);
    }
}
