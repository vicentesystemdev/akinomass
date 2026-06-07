<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Models\Carrito;
use Illuminate\Support\Facades\DB;

class VaciarCarritoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(Carrito $carrito): void
    {
        DB::transaction(function () use ($carrito) {
            $this->reservaService->liberarReservasPorCarrito($carrito);
            $this->persistenciaService->vaciar($carrito);
        });
    }
}
