<?php

namespace App\Domains\InteligenciaVentas\Actions;

use App\Domains\InteligenciaVentas\Services\ResumenInteligenciaVentasService;

class ListarResumenInteligenciaVentasAction
{
    public function __construct(private readonly ResumenInteligenciaVentasService $service) {}

    public function execute(): array
    {
        return $this->service->resumen();
    }
}
