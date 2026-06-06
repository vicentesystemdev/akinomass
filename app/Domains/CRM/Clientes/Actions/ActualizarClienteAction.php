<?php

namespace App\Domains\CRM\Clientes\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\Cliente;

class ActualizarClienteAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(Cliente $cliente, array $data): Cliente
    {
        $original = $cliente->getOriginal();
        $cliente->update($data);

        $contexto = RegistrarAuditoriaData::fromRequest(request());

        $changed = array_intersect_key($data, $original);
        $changed = array_filter($changed, fn($v, $k) => ($original[$k] ?? null) != $v, ARRAY_FILTER_USE_BOTH);

        if (!empty($changed)) {
            $this->auditoriaService->registrarCambios(
                $contexto, 'CRM', 'clientes', (string) $cliente->cod_cliente,
                $original, $changed,
            );
        }

        return $cliente->refresh();
    }
}
