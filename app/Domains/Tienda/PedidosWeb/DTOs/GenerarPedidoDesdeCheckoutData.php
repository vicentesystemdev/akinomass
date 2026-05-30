<?php

namespace App\Domains\Tienda\PedidosWeb\DTOs;

readonly class GenerarPedidoDesdeCheckoutData
{
    public function __construct(
        public int $codCheckoutSesion,
        public ?string $sessionId = null,
        public ?string $ipOrigen = null,
        public ?string $userAgent = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            codCheckoutSesion: (int) $data['cod_checkout_sesion'],
            sessionId: $data['session_id'] ?? null,
            ipOrigen: $data['ip_origen'] ?? null,
            userAgent: $data['user_agent'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'cod_checkout_sesion' => $this->codCheckoutSesion,
            'session_id' => $this->sessionId,
            'ip_origen' => $this->ipOrigen,
            'user_agent' => $this->userAgent,
        ];
    }
}
