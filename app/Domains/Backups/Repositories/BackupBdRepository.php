<?php

namespace App\Domains\Backups\Repositories;

use App\Domains\Backups\Enums\EstadoBackupEnum;
use App\Models\BackupBd;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BackupBdRepository
{
    public function paginar(int $perPage = 15): LengthAwarePaginator
    {
        return BackupBd::with('usuario')
            ->orderByDesc('bck_fecha')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function obtenerPorId(int $id): ?BackupBd
    {
        return BackupBd::with('usuario')->find($id);
    }

    public function existeEnProceso(): bool
    {
        return BackupBd::where('bck_estado', EstadoBackupEnum::EN_PROCESO)
            ->exists();
    }
}
