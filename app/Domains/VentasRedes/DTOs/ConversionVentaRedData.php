<?php

namespace App\Domains\VentasRedes\DTOs;

readonly class ConversionVentaRedData
{
    public function __construct(public ?string $observacion = null) {}
}
