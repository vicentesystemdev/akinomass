<?php

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\InteligenciaVentas\Repositories\PrediccionVentasRepository;

class LimpiarPrediccionesVentasAction
{
    public function __construct(
        private readonly PrediccionVentasRepository $repository,
        private readonly RegistrarAuditoriaService $auditoria,
    ) {}

    public function execute(): int
    {
        $total = $this->repository->limpiar();
        $this->auditoria->registrarAccion(
            RegistrarAuditoriaData::fromRequest(request()),
            'InteligenciaVentas',
            'predicciones_ventas',
            'batch',
            'limpiar',
            submodulo: 'Predicciones',
            accionFuncional: 'Limpieza de predicciones',
            descripcion: "Se eliminaron {$total} predicciones sin borrar ventas, productos ni inventario.",
        );

        return $total;
    }
}
