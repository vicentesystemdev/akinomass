<?php

namespace App\Domains\Auditoria\Listeners;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;

class AuditarLoginListener
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function handle(Login|Logout|Registered $event): void
    {
        $request = request();
        $contexto = RegistrarAuditoriaData::fromRequest($request);

        if ($event instanceof Login) {
            $user = $event->user;
            $esCliente = $user->hasRole('Cliente');

            $this->auditoriaService->registrarAccion(
                $contexto, 'Seguridad', 'users', (string) $user->id, 'login',
                submodulo: 'Autenticación',
                accionFuncional: 'Inicio de sesión',
                descripcion: $esCliente
                    ? "El cliente {$user->email} inició sesión en la tienda online."
                    : "El usuario {$user->email} inició sesión en el panel administrativo.",
            );

        } elseif ($event instanceof Logout) {
            $user = Auth::user();
            if (!$user) {
                return;
            }

            $esCliente = $user->hasRole('Cliente');

            $this->auditoriaService->registrarAccion(
                $contexto, 'Seguridad', 'users', (string) $user->id, 'logout',
                submodulo: 'Autenticación',
                accionFuncional: 'Cierre de sesión',
                descripcion: $esCliente
                    ? "El cliente {$user->email} cerró sesión en la tienda online."
                    : "El usuario {$user->email} cerró sesión del panel administrativo.",
            );

        } elseif ($event instanceof Registered) {
            $user = $event->user;

            $this->auditoriaService->registrarAccion(
                $contexto, 'Tienda', 'users', (string) $user->id, 'insert',
                submodulo: 'Registro',
                accionFuncional: 'Registro de cliente',
                descripcion: "El cliente {$user->email} se registró en la tienda online.",
            );
        }
    }
}
