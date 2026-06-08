<?php

namespace App\Domains\VentasRedes\DTOs;

readonly class FiltroVentaRedData
{
    public function __construct(
        public ?string $estado = null,
        public ?int $codCanalVenta = null,
        public ?string $tipoInteraccion = null,
        public ?int $codUsuarioResponsable = null,
        public ?string $desde = null,
        public ?string $hasta = null,
        public ?string $busqueda = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            estado: $data['estado'] ?? null,
            codCanalVenta: isset($data['cod_canal_venta']) ? (int) $data['cod_canal_venta'] : null,
            tipoInteraccion: $data['tipo_interaccion'] ?? null,
            codUsuarioResponsable: isset($data['cod_usuario_responsable']) ? (int) $data['cod_usuario_responsable'] : null,
            desde: $data['desde'] ?? null,
            hasta: $data['hasta'] ?? null,
            busqueda: $data['busqueda'] ?? null,
        );
    }
}
