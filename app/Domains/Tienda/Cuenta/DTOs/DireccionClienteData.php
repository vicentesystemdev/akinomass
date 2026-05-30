<?php

namespace App\Domains\Tienda\Cuenta\DTOs;

class DireccionClienteData
{
    public function __construct(
        public readonly string $etiquetaDir,
        public readonly string $nombreDestinatarioDir,
        public readonly ?string $telefonoDir,
        public readonly string $direccionDir,
        public readonly ?string $ciudadDir,
        public readonly ?string $departamentoDir,
        public readonly ?string $codigoPostalDir,
        public readonly ?string $referenciaDir,
        public readonly ?string $documentoNitDir,
        public readonly ?string $razonSocialDir,
        public readonly bool $esPredeterminadaDir = false,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            etiquetaDir: $data['etiqueta_dir'],
            nombreDestinatarioDir: $data['nombre_destinatario_dir'],
            telefonoDir: $data['telefono_dir'] ?? null,
            direccionDir: $data['direccion_dir'],
            ciudadDir: $data['ciudad_dir'] ?? null,
            departamentoDir: $data['departamento_dir'] ?? null,
            codigoPostalDir: $data['codigo_postal_dir'] ?? null,
            referenciaDir: $data['referencia_dir'] ?? null,
            documentoNitDir: $data['documento_nit_dir'] ?? null,
            razonSocialDir: $data['razon_social_dir'] ?? null,
            esPredeterminadaDir: $data['es_predeterminada_dir'] ?? false,
        );
    }

    public function toArray(): array
    {
        return [
            'etiqueta_dir' => $this->etiquetaDir,
            'nombre_destinatario_dir' => $this->nombreDestinatarioDir,
            'telefono_dir' => $this->telefonoDir,
            'direccion_dir' => $this->direccionDir,
            'ciudad_dir' => $this->ciudadDir,
            'departamento_dir' => $this->departamentoDir,
            'codigo_postal_dir' => $this->codigoPostalDir,
            'referencia_dir' => $this->referenciaDir,
            'documento_nit_dir' => $this->documentoNitDir,
            'razon_social_dir' => $this->razonSocialDir,
            'es_predeterminada_dir' => $this->esPredeterminadaDir,
        ];
    }
}
