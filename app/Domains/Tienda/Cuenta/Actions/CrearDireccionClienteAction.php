<?php

namespace App\Domains\Tienda\Cuenta\Actions;

use App\Domains\Tienda\Cuenta\DTOs\DireccionClienteData;
use App\Models\DireccionCliente;
use Illuminate\Support\Facades\DB;

class CrearDireccionClienteAction
{
    public function execute(int $codCliente, DireccionClienteData $data): DireccionCliente
    {
        return DB::transaction(function () use ($codCliente, $data) {
            if ($data->esPredeterminadaDir) {
                DireccionCliente::where('cod_cliente', $codCliente)
                    ->where('es_predeterminada_dir', true)
                    ->update(['es_predeterminada_dir' => false]);
            }

            return DireccionCliente::create([
                'cod_cliente' => $codCliente,
                ...$data->toArray(),
                'activo_dir' => true,
            ]);
        });
    }
}
