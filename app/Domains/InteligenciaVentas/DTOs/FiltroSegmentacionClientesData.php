<?php

declare(strict_types=1);

namespace App\Domains\InteligenciaVentas\DTOs;

final readonly class FiltroSegmentacionClientesData
{
    public function __construct(
        public int $clusters = 3,
        public ?string $periodoInicio = null,
        public ?string $periodoFin = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            clusters: max(2, min(6, (int) ($data['clusters'] ?? 3))),
            periodoInicio: $data['periodo_inicio'] ?? null,
            periodoFin: $data['periodo_fin'] ?? null,
        );
    }
}
