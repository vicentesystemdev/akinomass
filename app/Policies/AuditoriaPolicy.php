<?php

namespace App\Policies;

use App\Models\AuditoriaSis;
use App\Models\User;

class AuditoriaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('auditoria.ver');
    }

    public function view(User $user, AuditoriaSis $auditoria): bool
    {
        return $user->hasPermissionTo('auditoria.ver_detalle');
    }
}
