<?php

namespace App\Domains\InteligenciaVentas\DTOs;

readonly class ConfiguracionInteligenciaVentasData
{
    public function __construct(public array $attributes) {}

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
