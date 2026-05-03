<?php

namespace App\Domains\Inventario\Actions;

use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Domains\Inventario\Services\InventarioService;
use App\Models\Inventario;

class RegistrarEntradaInventarioAction
{
    public function __construct(private readonly InventarioService $service) {}
    public function execute(array $data, ?int $codUsuario): Inventario
    {
        return $this->service->registrarMovimiento($data['cod_producto'], TipoMovimientoInventarioEnum::ENTRADA, $data['cantidad_mov'], $data['motivo_mov'], $data['observacion_mov'] ?? null, $codUsuario);
    }
}
