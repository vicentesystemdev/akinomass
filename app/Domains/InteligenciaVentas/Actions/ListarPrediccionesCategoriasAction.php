<?php

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\InteligenciaVentas\Repositories\PrediccionVentasRepository;
use Illuminate\Support\Collection;

class ListarPrediccionesCategoriasAction
{
    public function __construct(private readonly PrediccionVentasRepository $repository) {}

    public function execute(): Collection
    {
        return $this->repository->categorias();
    }
}
