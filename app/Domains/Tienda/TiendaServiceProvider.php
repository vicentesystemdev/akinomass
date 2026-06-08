<?php

namespace App\Domains\Tienda;

use App\Domains\Comercial\Pagos\Events\PagoConfirmadoEvent;
use App\Domains\Tienda\Facturacion\Listeners\EmitirFacturaTrasConfirmacionListener;
use App\Domains\Tienda\PagosWeb\Events\PagoTiendaAceptadoEvent;
use App\Domains\Tienda\PagosWeb\Events\StockPedidoWebDescontadoEvent;
use App\Domains\Tienda\PagosWeb\Listeners\ActualizarEstadoTrasPagoConfirmadoListener;
use App\Domains\Tienda\PagosWeb\Listeners\ConfirmarPedidoTrasPagoWebListener;
use App\Domains\Tienda\PagosWeb\Listeners\RegistrarAuditoriaPagoAceptadoListener;
use App\Domains\Tienda\PagosWeb\Listeners\RegistrarAuditoriaStockDescontadoListener;
use App\Domains\Tienda\PedidosWeb\Events\PedidoWebGeneradoEvent;
use App\Domains\Tienda\PedidosWeb\Listeners\ActualizarCheckoutTrasPedidoListener;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class TiendaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Event::listen(PedidoWebGeneradoEvent::class, ActualizarCheckoutTrasPedidoListener::class);

        $listenersPagoConfirmado = [
            ActualizarEstadoTrasPagoConfirmadoListener::class,
            ConfirmarPedidoTrasPagoWebListener::class,
            EmitirFacturaTrasConfirmacionListener::class,
        ];

        foreach ($listenersPagoConfirmado as $listener) {
            Event::listen(PagoConfirmadoEvent::class, $listener);
        }

        Event::listen(PagoTiendaAceptadoEvent::class, RegistrarAuditoriaPagoAceptadoListener::class);
        Event::listen(StockPedidoWebDescontadoEvent::class, RegistrarAuditoriaStockDescontadoListener::class);
    }
}
