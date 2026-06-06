<?php

namespace App\Domains\Auditoria;

use App\Domains\Auditoria\Listeners\AuditarCambioRolListener;
use App\Domains\Auditoria\Listeners\AuditarLoginListener;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Events\RoleAssigned;
use Spatie\Permission\Events\PermissionAssigned;

class AuditoriaServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Event::listen(Login::class, AuditarLoginListener::class);
        Event::listen(Logout::class, AuditarLoginListener::class);
        Event::listen(Registered::class, AuditarLoginListener::class);

        Event::listen(RoleAssigned::class, AuditarCambioRolListener::class);
        Event::listen(PermissionAssigned::class, AuditarCambioRolListener::class);
    }
}
