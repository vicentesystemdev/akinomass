<?php

namespace App\Domains\InteligenciaVentas\DTOs;

readonly class ResultadoPrediccionVentaData
{
    public function __construct(public array $attributes) {}

    public function toArray(): array
    {
        return $this->attributes;
    }
}
