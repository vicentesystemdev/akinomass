<?php

namespace App\Domains\CRM\Clientes\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\Cliente;

class CrearClienteAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(array $data): Cliente
    {
        $cliente = Cliente::create($data);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarInsercion(
            $contexto, 'CRM', 'clientes', (string) $cliente->cod_cliente,
        );

        return $cliente;
    }
}
