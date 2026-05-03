<?php

namespace App\Http\Requests\Clientes;

class UpdateClienteRequest extends StoreClienteRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('clientes.editar') ?? false;
    }
}
