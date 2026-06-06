<?php

namespace App\Domains\Inventario\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Domains\Inventario\Services\InventarioService;
use App\Models\Inventario;

class RegistrarSalidaInventarioAction
{
    public function __construct(private readonly InventarioService $service, private RegistrarAuditoriaService $auditoriaService) {}
    public function execute(array $data, ?int $codUsuario): Inventario
    {
        $inventario = $this->service->registrarMovimiento($data['cod_producto'], TipoMovimientoInventarioEnum::SALIDA, $data['cantidad_mov'], $data['motivo_mov'], $data['observacion_mov'] ?? null, $codUsuario);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarInsercion($contexto, 'Inventario', 'movimientos_inventario', (string) $data['cod_producto'], submodulo: 'Salida');

        return $inventario;
    }
}
