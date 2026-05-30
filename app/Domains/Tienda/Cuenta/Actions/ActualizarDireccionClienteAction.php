<?php

namespace App\Domains\Tienda\Cuenta\Actions;

use App\Domains\Tienda\Cuenta\DTOs\DireccionClienteData;
use App\Models\DireccionCliente;
use Illuminate\Support\Facades\DB;

class ActualizarDireccionClienteAction
{
    public function execute(DireccionCliente $direccion, DireccionClienteData $data): DireccionCliente
    {
        return DB::transaction(function () use ($direccion, $data) {
            if ($data->esPredeterminadaDir && !$direccion->es_predeterminada_dir) {
                DireccionCliente::where('cod_cliente', $direccion->cod_cliente)
                    ->where('es_predeterminada_dir', true)
                    ->update(['es_predeterminada_dir' => false]);
            }

            $direccion->update($data->toArray());

            return $direccion->refresh();
        });
    }
}
