<?php

namespace App\Domains\Tienda\Catalogo\Actions;

use App\Domains\Tienda\Catalogo\Repositories\CatalogoPublicoRepository;
use Illuminate\Support\Collection;

class ListarCategoriasPublicasAction
{
    public function __construct(
        private CatalogoPublicoRepository $repository,
    ) {}

    public function execute(): Collection
    {
        return $this->repository->listarCategoriasConProductos();
    }
}
