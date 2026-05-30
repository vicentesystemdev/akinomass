<?php

namespace App\Domains\Tienda\Cuenta\Actions;

use App\Domains\Tienda\Cuenta\DTOs\CrearCuentaClienteData;
use App\Domains\Tienda\Cuenta\Enums\EstadoCuentaClienteEnum;
use App\Models\Cliente;
use App\Models\CuentaCliente;
use Illuminate\Support\Facades\DB;

class CrearCuentaClienteAction
{
    public function execute(CrearCuentaClienteData $data): CuentaCliente
    {
        if (CuentaCliente::where('user_id', $data->userId)->exists()) {
            throw new \RuntimeException('Ya existe una cuenta de cliente para este usuario.');
        }

        return DB::transaction(function () use ($data) {
            $cliente = Cliente::create([
                'nombre_cli' => $data->nombreCli,
                'telefono_cli' => $data->telefonoCli,
                'correo_cli' => $data->correoCli,
                'estado_cli' => 'activo',
                'cod_canal_venta' => $data->codCanalVenta,
                'cod_tipo_flujo_comercial' => $data->codTipoFlujoComercial,
            ]);

            return CuentaCliente::create([
                'user_id' => $data->userId,
                'cod_cliente' => $cliente->cod_cliente,
                'estado_cue' => EstadoCuentaClienteEnum::ACTIVA->value,
                'fecha_activacion_cue' => now(),
            ]);
        });
    }
}
