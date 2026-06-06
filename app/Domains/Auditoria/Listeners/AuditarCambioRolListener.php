<?php

namespace App\Domains\Auditoria\Listeners;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use Spatie\Permission\Events\PermissionAssigned;
use Spatie\Permission\Events\RoleAssigned;

class AuditarCambioRolListener
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function handle(RoleAssigned|PermissionAssigned $event): void
    {
        $request = request();
        $contexto = RegistrarAuditoriaData::fromRequest($request);

        if ($event instanceof RoleAssigned) {
            $role = $event->role;
            $user = $event->model;

            $this->auditoriaService->registrarAccion(
                $contexto, 'Seguridad', 'model_has_roles', (string) $user->id, 'insert',
                submodulo: 'Roles',
                accionFuncional: 'Asignación de rol',
                descripcion: "Se asignó el rol '{$role->name}' al usuario {$user->email}.",
            );
        }

        if ($event instanceof PermissionAssigned) {
            $permission = $event->permission;
            $user = $event->model;

            $this->auditoriaService->registrarAccion(
                $contexto, 'Seguridad', 'model_has_permissions', (string) $user->id, 'insert',
                submodulo: 'Permisos',
                accionFuncional: 'Asignación de permiso',
                descripcion: "Se asignó el permiso '{$permission->name}' al usuario {$user->email}.",
            );
        }
    }
}
