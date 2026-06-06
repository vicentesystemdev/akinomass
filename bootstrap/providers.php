<?php

use App\Domains\Auditoria\AuditoriaServiceProvider;
use App\Domains\Tienda\TiendaServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    TiendaServiceProvider::class,
    AuditoriaServiceProvider::class,
];
