<?php

namespace App\Domains\Tienda\Carrito\DTOs;

readonly class AgregarItemCarritoData
{
    public function __construct(
        public int $codProducto,
        public int $cantidad,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            codProducto: (int) $data['cod_producto'],
            cantidad: (int) $data['cantidad'],
        );
    }

    public function toArray(): array
    {
        return [
            'cod_producto' => $this->codProducto,
            'cantidad' => $this->cantidad,
        ];
    }
}
