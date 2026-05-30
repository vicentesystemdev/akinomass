<?php

namespace App\Domains\Tienda\Cuenta\Actions;

use App\Domains\Tienda\Cuenta\Enums\EstadoCuentaClienteEnum;
use App\Models\Cliente;
use App\Models\CuentaCliente;

class VincularUsuarioClienteExistenteAction
{
    public function execute(int $userId, string $email): ?CuentaCliente
    {
        $cliente = Cliente::where('correo_cli', $email)->first();

        if (!$cliente) {
            return null;
        }

        return CuentaCliente::create([
            'user_id' => $userId,
            'cod_cliente' => $cliente->cod_cliente,
            'estado_cue' => EstadoCuentaClienteEnum::ACTIVA->value,
            'fecha_activacion_cue' => now(),
        ]);
    }
}
