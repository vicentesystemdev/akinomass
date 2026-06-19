<?php

declare(strict_types=1);

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\InteligenciaVentas\DTOs\FiltroTendenciaVentasData;
use App\Domains\InteligenciaVentas\Repositories\TendenciaVentasRepository;
use App\Domains\InteligenciaVentas\Services\TendenciaVentasRegresionLinealService;

final class AnalizarTendenciaVentasAction
{
    public function __construct(
        private readonly TendenciaVentasRepository $repository,
        private readonly TendenciaVentasRegresionLinealService $service,
    ) {}

    public function execute(array $filtros = []): array
    {
        $filtro = FiltroTendenciaVentasData::fromArray($filtros);

        return [
            ...$this->service->analizar($this->repository->series($filtro)),
            'filtros' => [
                'periodicidad' => $filtro->periodicidad,
                'metrica' => $filtro->metrica,
                'periodo_inicio' => $filtro->periodoInicio,
                'periodo_fin' => $filtro->periodoFin,
                'cod_categoria_producto' => $filtro->codCategoriaProducto,
                'cod_producto' => $filtro->codProducto,
                'cod_canal_venta' => $filtro->codCanalVenta,
            ],
            'opciones' => $this->repository->opciones(),
        ];
    }
}
