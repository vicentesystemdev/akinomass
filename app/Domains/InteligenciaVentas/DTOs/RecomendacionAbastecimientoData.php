<?php

namespace App\Domains\InteligenciaVentas\DTOs;

readonly class RecomendacionAbastecimientoData
{
    public function __construct(
        public int $cantidadSugerida,
        public string $nivelRecomendacion,
        public string $nivelRiesgoStock,
        public int $stockSeguridadDinamico,
        public float $ratioCobertura,
        public float $rotacionStock,
    ) {}
}
