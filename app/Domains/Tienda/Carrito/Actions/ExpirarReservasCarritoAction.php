<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;

class ExpirarReservasCarritoAction
{
    public function __construct(
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(): int
    {
        return $this->reservaService->expirarReservasVencidas();
    }
}
