<?php

namespace App\Domains\VentasRedes\Services;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\VentaRed;

class TrazabilidadVentaRedService
{
    public function __construct(private readonly RegistrarAuditoriaService $auditoriaService) {}

    public function registrarCreacion(VentaRed $ventaRed): void
    {
        $this->auditoriaService->registrarInsercion(
            RegistrarAuditoriaData::fromRequest(request()),
            'VentasRedes',
            'ventas_redes',
            (string) $ventaRed->cod_venta_red,
            submodulo: 'Creacion',
            descripcion: "Se registro la venta por redes {$ventaRed->codigo_venta_red}.",
        );
    }

    public function registrarAccion(VentaRed $ventaRed, string $accion, string $descripcion, ?string $campo = null, ?string $anterior = null, ?string $nuevo = null): void
    {
        $this->auditoriaService->registrarAccion(
            RegistrarAuditoriaData::fromRequest(request()),
            'VentasRedes',
            'ventas_redes',
            (string) $ventaRed->cod_venta_red,
            $accion,
            submodulo: 'Operacion',
            accionFuncional: $descripcion,
            descripcion: $descripcion,
            campo: $campo,
            valorAnterior: $anterior,
            valorNuevo: $nuevo,
        );
    }
}
