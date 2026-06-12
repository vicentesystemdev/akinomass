<?php

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\InteligenciaVentas\DTOs\FiltroInteligenciaVentasData;
use App\Domains\InteligenciaVentas\Repositories\PrediccionVentasRepository;
use Illuminate\Support\Collection;

class ListarPrediccionesProductosAction
{
    public function __construct(private readonly PrediccionVentasRepository $repository) {}

    public function execute(array $filtros = []): Collection
    {
        return $this->repository->listar(FiltroInteligenciaVentasData::fromArray($filtros));
    }
}
