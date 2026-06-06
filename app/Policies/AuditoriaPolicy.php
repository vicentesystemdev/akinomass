<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Foundation\Auth\User as Authenticatable;

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
