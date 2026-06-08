<?php

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\InteligenciaVentas\DTOs\ConclusionesInteligenciaVentasData;
use App\Domains\InteligenciaVentas\Services\ConclusionesInteligenciaVentasService;

class ListarConclusionesInteligenciaVentasAction
{
    public function __construct(private readonly ConclusionesInteligenciaVentasService $service) {}

    public function execute(array $filtros = []): array
    {
        return $this->service->construir(ConclusionesInteligenciaVentasData::fromArray($filtros));
    }
}
