<?php

namespace App\Domains\CRM\Clientes\Actions;

use App\Models\Cliente;

class ActualizarClienteAction
{
    public function execute(Cliente $cliente, array $data): Cliente
    {
        $cliente->update($data);

        return $cliente->refresh();
    }
}
