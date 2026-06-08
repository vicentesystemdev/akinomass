<?php

namespace App\Domains\VentasRedes\DTOs;

readonly class DetalleVentaRedData
{
    public function __construct(public array $attributes) {}

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
