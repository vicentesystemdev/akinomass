<?php

namespace App\Domains\InteligenciaVentas\DTOs;

readonly class FiltroInteligenciaVentasData
{
    public function __construct(
        public ?int $codCategoriaProducto = null,
        public ?int $codProducto = null,
        public ?int $codCanalVenta = null,
        public ?string $nivelRecomendacion = null,
        public ?string $nivelRiesgoStock = null,
        public ?string $periodoInicio = null,
        public ?string $periodoFin = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            codCategoriaProducto: isset($data['cod_categoria_producto']) ? (int) $data['cod_categoria_producto'] : null,
            codProducto: isset($data['cod_producto']) ? (int) $data['cod_producto'] : null,
            codCanalVenta: isset($data['cod_canal_venta']) ? (int) $data['cod_canal_venta'] : null,
            nivelRecomendacion: $data['nivel_recomendacion'] ?? null,
            nivelRiesgoStock: $data['nivel_riesgo_stock'] ?? null,
            periodoInicio: $data['periodo_inicio'] ?? null,
            periodoFin: $data['periodo_fin'] ?? null,
        );
    }
}
