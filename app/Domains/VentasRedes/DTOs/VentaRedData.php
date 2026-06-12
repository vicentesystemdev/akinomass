<?php

namespace App\Domains\VentasRedes\DTOs;

readonly class VentaRedData
{
    public function __construct(public array $attributes) {}

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
