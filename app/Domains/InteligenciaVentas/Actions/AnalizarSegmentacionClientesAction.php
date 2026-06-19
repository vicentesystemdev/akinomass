<?php

declare(strict_types=1);

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\InteligenciaVentas\DTOs\FiltroSegmentacionClientesData;
use App\Domains\InteligenciaVentas\Repositories\SegmentacionClientesRepository;
use App\Domains\InteligenciaVentas\Services\SegmentacionClientesClusteringService;

final class AnalizarSegmentacionClientesAction
{
    public function __construct(
        private readonly SegmentacionClientesRepository $repository,
        private readonly SegmentacionClientesClusteringService $service,
    ) {}

    public function execute(array $filtros = []): array
    {
        $filtro = FiltroSegmentacionClientesData::fromArray($filtros);
        $resultado = $this->service->segmentar($this->repository->metricas($filtro), $filtro->clusters);

        return [
            ...$resultado,
            'filtros' => [
                'clusters' => $filtro->clusters,
                'periodo_inicio' => $filtro->periodoInicio,
                'periodo_fin' => $filtro->periodoFin,
            ],
        ];
    }
}
