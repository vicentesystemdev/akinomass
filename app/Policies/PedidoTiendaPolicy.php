<?php

namespace App\Policies;

use App\Models\CuentaCliente;
use App\Models\PedidoTienda;
use App\Models\User;

class PedidoTiendaPolicy
{
    public function view(User $user, PedidoTienda $pedidoTienda): bool
    {
        $cuentaCliente = CuentaCliente::where('user_id', $user->id)->first();

        if (!$cuentaCliente) {
            return false;
        }

        return $pedidoTienda->cod_cuenta_cliente === $cuentaCliente->cod_cuenta_cliente;
    }
}
