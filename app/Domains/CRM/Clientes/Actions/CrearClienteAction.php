<?php

namespace App\Domains\CRM\Clientes\Actions;

use App\Models\Cliente;

class CrearClienteAction
{
    public function execute(array $data): Cliente
    {
        return Cliente::create($data);
    }
}
