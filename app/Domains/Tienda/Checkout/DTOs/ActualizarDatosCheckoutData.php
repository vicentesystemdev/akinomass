<?php

namespace App\Domains\Tienda\Checkout\DTOs;

readonly class ActualizarDatosCheckoutData
{
    public function __construct(
        public string $emailContacto,
        public ?string $telefonoContacto = null,
        public ?int $codDireccionCliente = null,
        public ?string $direccionEntrega = null,
        public ?string $documentoFacturacion = null,
        public ?string $razonSocial = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            emailContacto: $data['email_contacto'],
            telefonoContacto: $data['telefono_contacto'] ?? null,
            codDireccionCliente: isset($data['cod_direccion_cliente']) ? (int) $data['cod_direccion_cliente'] : null,
            direccionEntrega: $data['direccion_entrega'] ?? null,
            documentoFacturacion: $data['documento_facturacion'] ?? null,
            razonSocial: $data['razon_social'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'email_contacto' => $this->emailContacto,
            'telefono_contacto' => $this->telefonoContacto,
            'cod_direccion_cliente' => $this->codDireccionCliente,
            'direccion_entrega' => $this->direccionEntrega,
            'documento_facturacion' => $this->documentoFacturacion,
            'razon_social' => $this->razonSocial,
        ], fn($v) => $v !== null);
    }
}
