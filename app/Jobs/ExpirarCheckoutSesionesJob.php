<?php

namespace App\Jobs;

use App\Domains\Tienda\Checkout\Actions\ExpirarCheckoutSesionesAction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ExpirarCheckoutSesionesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct()
    {
        $this->queue = 'default';
    }

    public function handle(ExpirarCheckoutSesionesAction $action): void
    {
        $expiradas = $action->execute();

        if ($expiradas > 0) {
            info("Checkout: {$expiradas} sesiones expiradas.");
        }
    }
}
