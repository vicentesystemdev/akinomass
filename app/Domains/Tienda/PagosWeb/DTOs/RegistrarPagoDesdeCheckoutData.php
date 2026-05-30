<?php

namespace App\Domains\Tienda\PagosWeb\DTOs;

readonly class RegistrarPagoDesdeCheckoutData
{
    public function __construct(
        public int $codCheckoutSesion,
        public string $metodoPagoPag,
        public ?string $referenciaPag = null,
        public ?string $bancoOrigen = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            codCheckoutSesion: (int) $data['cod_checkout_sesion'],
            metodoPagoPag: $data['metodo_pago_pag'],
            referenciaPag: $data['referencia_pag'] ?? null,
            bancoOrigen: $data['banco_origen'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'cod_checkout_sesion' => $this->codCheckoutSesion,
            'metodo_pago_pag' => $this->metodoPagoPag,
            'referencia_pag' => $this->referenciaPag,
            'banco_origen' => $this->bancoOrigen,
        ];
    }
}
