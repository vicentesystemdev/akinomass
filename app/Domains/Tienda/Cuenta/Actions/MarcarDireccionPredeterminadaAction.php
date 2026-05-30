<?php

namespace App\Domains\Tienda\Cuenta\Actions;

use App\Models\DireccionCliente;
use Illuminate\Support\Facades\DB;

class MarcarDireccionPredeterminadaAction
{
    public function execute(DireccionCliente $direccion): DireccionCliente
    {
        return DB::transaction(function () use ($direccion) {
            DireccionCliente::where('cod_cliente', $direccion->cod_cliente)
                ->where('es_predeterminada_dir', true)
                ->update(['es_predeterminada_dir' => false]);

            $direccion->update(['es_predeterminada_dir' => true]);

            return $direccion->refresh();
        });
    }
}
