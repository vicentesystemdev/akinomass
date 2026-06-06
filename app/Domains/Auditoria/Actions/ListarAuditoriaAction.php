<?php

namespace App\Domains\Auditoria\Actions;

use App\Models\AuditoriaSis;
use Illuminate\Http\Request;

class ListarAuditoriaAction
{
    public function execute(Request $request): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = AuditoriaSis::with(['user', 'cliente']);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('cod_cliente')) {
            $query->where('cod_cliente', $request->input('cod_cliente'));
        }

        if ($request->filled('accion_aud')) {
            $query->where('accion_aud', $request->input('accion_aud'));
        }

        if ($request->filled('modulo_aud')) {
            $query->where('modulo_aud', $request->input('modulo_aud'));
        }

        if ($request->filled('tabla_aud')) {
            $query->where('tabla_aud', $request->input('tabla_aud'));
        }

        if ($request->filled('id_registro_aud')) {
            $query->where('id_registro_aud', $request->input('id_registro_aud'));
        }

        if ($request->filled('fecha_desde')) {
            $query->where('fecha_aud', '>=', $request->input('fecha_desde') . ' 00:00:00');
        }

        if ($request->filled('fecha_hasta')) {
            $query->where('fecha_aud', '<=', $request->input('fecha_hasta') . ' 23:59:59');
        }

        if ($request->filled('buscar')) {
            $buscar = $request->input('buscar');
            $query->where(function ($q) use ($buscar) {
                $q->where('descripcion_aud', 'ilike', "%{$buscar}%")
                  ->orWhere('accion_funcional_aud', 'ilike', "%{$buscar}%")
                  ->orWhere('tabla_aud', 'ilike', "%{$buscar}%")
                  ->orWhere('id_registro_aud', 'ilike', "%{$buscar}%")
                  ->orWhere('ip_aud', 'ilike', "%{$buscar}%");
            });
        }

        return $query->orderBy('fecha_aud', 'desc')->paginate(25)->withQueryString();
    }
}
