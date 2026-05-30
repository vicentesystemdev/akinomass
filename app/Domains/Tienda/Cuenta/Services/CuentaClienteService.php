<?php

namespace App\Domains\Tienda\Cuenta\Services;

use App\Models\CuentaCliente;

class CuentaClienteService
{
    public function resolverPorUserId(int $userId): ?CuentaCliente
    {
        return CuentaCliente::where('user_id', $userId)
            ->where('estado_cue', 'activa')
            ->with(['cliente'])
            ->first();
    }

    public function existePorUserId(int $userId): bool
    {
        return CuentaCliente::where('user_id', $userId)->exists();
    }

    public function existePorClienteId(int $codCliente): bool
    {
        return CuentaCliente::where('cod_cliente', $codCliente)->exists();
    }
}
