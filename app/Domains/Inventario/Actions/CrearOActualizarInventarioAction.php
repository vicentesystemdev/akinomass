<?php

namespace App\Domains\Inventario\Actions;

use App\Domains\Inventario\Services\InventarioService;
use App\Models\Inventario;

class CrearOActualizarInventarioAction
{
    public function __construct(private readonly InventarioService $service) {}

    public function execute(array $data): Inventario
    {
        return $this->service->crearOActualizarInventario($data);
    }
}
