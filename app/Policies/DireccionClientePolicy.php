<?php

namespace App\Policies;

use App\Models\CuentaCliente;
use App\Models\DireccionCliente;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DireccionClientePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('cuenta.gestionar_direcciones');
    }

    public function view(User $user, DireccionCliente $direccion): bool
    {
        return $this->perteneceAlUsuario($user, $direccion);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('cuenta.gestionar_direcciones');
    }

    public function update(User $user, DireccionCliente $direccion): bool
    {
        return $this->perteneceAlUsuario($user, $direccion);
    }

    public function delete(User $user, DireccionCliente $direccion): bool
    {
        return $this->perteneceAlUsuario($user, $direccion);
    }

    protected function perteneceAlUsuario(User $user, DireccionCliente $direccion): bool
    {
        $cuenta = CuentaCliente::where('user_id', $user->id)->first();

        if (!$cuenta) {
            return false;
        }

        return $direccion->cod_cliente === $cuenta->cod_cliente;
    }
}
