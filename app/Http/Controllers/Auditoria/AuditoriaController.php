<?php

namespace App\Http\Controllers\Auditoria;

use App\Domains\Auditoria\Actions\ListarAuditoriaAction;
use App\Domains\Auditoria\Actions\ObtenerAuditoriaAction;
use App\Domains\Auditoria\Enums\TipoAccionAuditoriaEnum;
use App\Models\AuditoriaSis;
use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AuditoriaController extends Controller
{
    public function index(ListarAuditoriaAction $action): Response
    {
        $this->authorize('auditoria.ver');

        return Inertia::render('Auditoria/Index', [
            'logs' => $action->execute(request()),
            'usuarios' => User::select('id', 'name', 'email')->orderBy('name')->get(),
            'modulos' => AuditoriaSis::select('modulo_aud')->distinct()->orderBy('modulo_aud')->pluck('modulo_aud'),
            'acciones' => array_column(TipoAccionAuditoriaEnum::cases(), 'value'),
            'filtros' => request()->only([
                'user_id', 'cod_cliente', 'accion_aud', 'modulo_aud',
                'tabla_aud', 'id_registro_aud', 'fecha_desde', 'fecha_hasta', 'buscar',
            ]),
        ]);
    }

    public function show(int $codAuditoria, ObtenerAuditoriaAction $action): Response
    {
        $this->authorize('auditoria.ver_detalle');

        $log = $action->execute($codAuditoria);
        $relacionados = collect();

        if ($log->id_evento_aud) {
            $relacionados = $action->obtenerRelacionados($log->id_evento_aud, $codAuditoria);
        }

        return Inertia::render('Auditoria/Show', [
            'log' => $log->load(['user', 'cliente']),
            'relacionados' => $relacionados,
        ]);
    }
}
