<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Models\Carrito;

class VaciarCarritoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
    ) {}

    public function execute(Carrito $carrito): void
    {
        $this->persistenciaService->vaciar($carrito);
    }
}
