<?php

namespace App\Domains\Tienda\Checkout\DTOs;

readonly class IniciarCheckoutData
{
    public function __construct(
        public int $codCarrito,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            codCarrito: (int) $data['cod_carrito'],
        );
    }

    public function toArray(): array
    {
        return [
            'cod_carrito' => $this->codCarrito,
        ];
    }
}
