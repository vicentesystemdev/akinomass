<?php

namespace App\Domains\InteligenciaVentas\DTOs;

readonly class MatrizTransicionDemandaData
{
    public function __construct(
        public array $matriz,
        public array $probabilidades,
        public string $estadoPredicho,
        public string $nivelConfianza,
        public int $periodosHistoricos,
    ) {}
}
