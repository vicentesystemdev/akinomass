<?php

namespace App\Domains\Backups\Enums;

enum EstadoBackupEnum: string
{
    case EN_PROCESO = 'en_proceso';
    case EXITOSO = 'exitoso';
    case FALLIDO = 'fallido';
}
