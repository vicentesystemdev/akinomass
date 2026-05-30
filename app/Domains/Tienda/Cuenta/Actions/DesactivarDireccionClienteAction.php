<?php

namespace App\Domains\Tienda\Cuenta\Actions;

use App\Models\DireccionCliente;

class DesactivarDireccionClienteAction
{
    public function execute(DireccionCliente $direccion): DireccionCliente
    {
        $direccion->update(['activo_dir' => false]);

        return $direccion->refresh();
    }
}
