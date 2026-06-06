<?php

namespace App\Domains\Auditoria\Actions;

use App\Models\AuditoriaSis;

class ObtenerAuditoriaAction
{
    public function execute(int $codAuditoria): AuditoriaSis
    {
        return AuditoriaSis::with(['user', 'cliente'])->findOrFail($codAuditoria);
    }

    public function obtenerRelacionados(string $idEvento, int $excluirCod): \Illuminate\Database\Eloquent\Collection
    {
        return AuditoriaSis::with(['user', 'cliente'])
            ->where('id_evento_aud', $idEvento)
            ->where('cod_auditoria', '!=', $excluirCod)
            ->orderBy('fecha_aud', 'asc')
            ->get();
    }
}
