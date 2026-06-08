<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Enums\EstadoVentaRedEnum;
use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Domains\VentasRedes\Services\VentaRedService;
use App\Models\VentaRed;

class CambiarEstadoVentaRedAction
{
    public function __construct(
        private readonly VentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(VentaRed $ventaRed, string $estado): VentaRed
    {
        $anterior = $ventaRed->estado_venta_red->value;
        $actualizada = $this->service->cambiarEstado($ventaRed, EstadoVentaRedEnum::from($estado));
        $this->trazabilidad->registrarAccion($actualizada, 'cambio_estado', 'Cambio de estado de venta por redes.', 'estado_venta_red', $anterior, $estado);

        return $actualizada;
    }
}
