<?php

namespace App\Domains\InteligenciaVentas\DTOs;

readonly class ConclusionesInteligenciaVentasData
{
    public function __construct(
        public string $tipoAnalisis = 'meses',
        public int $horizonteMeses = 1,
        public string $temporada = 'invierno',
        public ?int $codCategoriaProducto = null,
        public ?int $codCanalVenta = null,
        public ?string $nivelRiesgoStock = null,
        public ?string $nivelRecomendacion = null,
    ) {}

    public static function fromArray(array $data): self
    {
        $tipoAnalisis = $data['tipo_analisis'] ?? 'meses';
        $temporada = $data['temporada'] ?? 'invierno';

        return new self(
            tipoAnalisis: in_array($tipoAnalisis, ['meses', 'temporada'], true) ? $tipoAnalisis : 'meses',
            horizonteMeses: min(4, max(1, (int) ($data['horizonte_meses'] ?? 1))),
            temporada: in_array($temporada, ['invierno', 'verano', 'otono', 'primavera'], true) ? $temporada : 'invierno',
            codCategoriaProducto: isset($data['cod_categoria_producto']) && $data['cod_categoria_producto'] !== '' ? (int) $data['cod_categoria_producto'] : null,
            codCanalVenta: isset($data['cod_canal_venta']) && $data['cod_canal_venta'] !== '' ? (int) $data['cod_canal_venta'] : null,
            nivelRiesgoStock: $data['nivel_riesgo_stock'] ?? null,
            nivelRecomendacion: $data['nivel_recomendacion'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'tipo_analisis' => $this->tipoAnalisis,
            'horizonte_meses' => $this->horizonteMeses,
            'temporada' => $this->temporada,
            'cod_categoria_producto' => $this->codCategoriaProducto,
            'cod_canal_venta' => $this->codCanalVenta,
            'nivel_riesgo_stock' => $this->nivelRiesgoStock,
            'nivel_recomendacion' => $this->nivelRecomendacion,
        ];
    }
}
