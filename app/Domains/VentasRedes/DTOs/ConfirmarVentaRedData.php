<?php

namespace App\Domains\VentasRedes\DTOs;

readonly class ConfirmarVentaRedData
{
    public function __construct(public ?string $observacion = null) {}
}
