<?php

namespace App\Domains\Tienda\Carrito\DTOs;

readonly class CarritoItemData
{
    public function __construct(
        public int $codProducto,
        public int $cantidad,
        public float $precioUnitario,
        public string $nombreSnapshot,
        public ?string $skuSnapshot,
        public float $subtotal,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            codProducto: (int) $data['cod_producto'],
            cantidad: (int) $data['cantidad'],
            precioUnitario: (float) $data['precio_unitario'],
            nombreSnapshot: $data['nombre_snapshot'],
            skuSnapshot: $data['sku_snapshot'] ?? null,
            subtotal: (float) $data['subtotal'],
        );
    }

    public function toArray(): array
    {
        return [
            'cod_producto' => $this->codProducto,
            'cantidad' => $this->cantidad,
            'precio_unitario' => $this->precioUnitario,
            'nombre_snapshot' => $this->nombreSnapshot,
            'sku_snapshot' => $this->skuSnapshot,
            'subtotal' => $this->subtotal,
        ];
    }
}
