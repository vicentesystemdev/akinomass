<?php

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\InteligenciaVentas\Repositories\CanalesAnaliticaRepository;
use Illuminate\Support\Collection;

class ListarAnalisisCanalesAction
{
    public function __construct(private readonly CanalesAnaliticaRepository $repository) {}

    public function execute(): Collection
    {
        return $this->repository->resumenCanales();
    }
}
