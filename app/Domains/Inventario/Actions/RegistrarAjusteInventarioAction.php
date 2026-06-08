<?php

namespace App\Domains\Inventario\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Domains\Inventario\Services\InventarioService;
use App\Models\Inventario;

class RegistrarAjusteInventarioAction
{
    public function __construct(private readonly InventarioService $service, private RegistrarAuditoriaService $auditoriaService) {}

    public function execute(array $data, ?int $codUsuario): Inventario
    {
        $inventario = $this->service->registrarMovimiento(
            $data['cod_producto'],
            TipoMovimientoInventarioEnum::AJUSTE,
            0,
            $data['motivo_mov'],
            $data['observacion_mov'] ?? null,
            $codUsuario,
            $data['stock_nuevo_mov'],
            $data['cod_variante_producto'] ?? null,
        );

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarAccion(
            $contexto, 'Inventario', 'inventarios', (string) $data['cod_producto'], 'update',
            submodulo: 'Ajuste',
            accionFuncional: 'Ajuste de inventario',
            descripcion: "Se ajustó el stock del producto #{$data['cod_producto']}.",
        );

        return $inventario;
    }
}
