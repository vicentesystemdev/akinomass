<?php

namespace App\Domains\Backups\Enums;

enum TipoBackupEnum: string
{
    case BASE = 'base';
    case INCREMENTAL = 'incremental';
}
