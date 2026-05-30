<?php

namespace App\Domains\Tienda\Cuenta\DTOs;

class CrearCuentaClienteData
{
    public function __construct(
        public readonly int $userId,
        public readonly string $nombreCli,
        public readonly ?string $telefonoCli,
        public readonly string $correoCli,
        public readonly int $codCanalVenta,
        public readonly int $codTipoFlujoComercial,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            nombreCli: $data['nombre_cli'],
            telefonoCli: $data['telefono_cli'] ?? null,
            correoCli: $data['correo_cli'],
            codCanalVenta: $data['cod_canal_venta'],
            codTipoFlujoComercial: $data['cod_tipo_flujo_comercial'],
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'nombre_cli' => $this->nombreCli,
            'telefono_cli' => $this->telefonoCli,
            'correo_cli' => $this->correoCli,
            'cod_canal_venta' => $this->codCanalVenta,
            'cod_tipo_flujo_comercial' => $this->codTipoFlujoComercial,
        ];
    }
}
