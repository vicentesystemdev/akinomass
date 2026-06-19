<?php

declare(strict_types=1);

namespace App\Domains\InteligenciaVentas\DTOs;

final readonly class FiltroTendenciaVentasData
{
    public function __construct(
        public string $periodicidad = 'mensual',
        public string $metrica = 'monto',
        public ?string $periodoInicio = null,
        public ?string $periodoFin = null,
        public ?int $codCategoriaProducto = null,
        public ?int $codProducto = null,
        public ?int $codCanalVenta = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            periodicidad: ($data['periodicidad'] ?? 'mensual') === 'semanal' ? 'semanal' : 'mensual',
            metrica: ($data['metrica'] ?? 'monto') === 'cantidad' ? 'cantidad' : 'monto',
            periodoInicio: $data['periodo_inicio'] ?? null,
            periodoFin: $data['periodo_fin'] ?? null,
            codCategoriaProducto: isset($data['cod_categoria_producto']) ? (int) $data['cod_categoria_producto'] : null,
            codProducto: isset($data['cod_producto']) ? (int) $data['cod_producto'] : null,
            codCanalVenta: isset($data['cod_canal_venta']) ? (int) $data['cod_canal_venta'] : null,
        );
    }
}
