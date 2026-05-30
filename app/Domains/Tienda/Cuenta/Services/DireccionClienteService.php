<?php

namespace App\Domains\Tienda\Cuenta\Services;

use App\Models\DireccionCliente;

class DireccionClienteService
{
    public function listarActivasPorCliente(int $codCliente): \Illuminate\Database\Eloquent\Collection
    {
        return DireccionCliente::where('cod_cliente', $codCliente)
            ->where('activo_dir', true)
            ->orderBy('es_predeterminada_dir', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function obtenerPredeterminada(int $codCliente): ?DireccionCliente
    {
        return DireccionCliente::where('cod_cliente', $codCliente)
            ->where('activo_dir', true)
            ->where('es_predeterminada_dir', true)
            ->first();
    }
}
