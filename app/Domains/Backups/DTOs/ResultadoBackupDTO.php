<?php

namespace App\Domains\Backups\DTOs;

use App\Domains\Backups\Enums\EstadoBackupEnum;
use App\Domains\Backups\Enums\TipoBackupEnum;

class ResultadoBackupDTO
{
    public function __construct(
        public readonly bool $exitoso,
        public readonly TipoBackupEnum $tipo,
        public readonly EstadoBackupEnum $estado,
        public readonly ?string $archivo = null,
        public readonly ?string $error = null,
    ) {}

    public static function exitoso(string $archivo, TipoBackupEnum $tipo): self
    {
        return new self(
            exitoso: true,
            tipo: $tipo,
            estado: EstadoBackupEnum::EXITOSO,
            archivo: $archivo,
        );
    }

    public static function fallido(TipoBackupEnum $tipo, string $error): self
    {
        return new self(
            exitoso: false,
            tipo: $tipo,
            estado: EstadoBackupEnum::FALLIDO,
            error: $error,
        );
    }
}
