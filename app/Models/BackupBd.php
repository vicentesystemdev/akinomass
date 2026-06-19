<?php

namespace App\Models;

use App\Domains\Backups\Enums\EstadoBackupEnum;
use App\Domains\Backups\Enums\TipoBackupEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BackupBd extends Model
{
    use HasFactory;

    protected $table = 'backups_bd';

    protected $primaryKey = 'bck_id';

    protected $fillable = [
        'usu_id',
        'bck_tipo',
        'bck_archivo',
        'bck_ruta',
        'bck_fecha',
        'bck_estado',
        'bck_desde',
        'bck_hasta',
        'bck_error',
    ];

    protected function casts(): array
    {
        return [
            'bck_tipo' => TipoBackupEnum::class,
            'bck_estado' => EstadoBackupEnum::class,
            'bck_fecha' => 'datetime',
            'bck_desde' => 'datetime',
            'bck_hasta' => 'datetime',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usu_id', 'id');
    }
}
