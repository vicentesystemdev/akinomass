<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditoriaSis extends Model
{
    use HasFactory;

    protected $table = 'auditoria_sis';

    protected $primaryKey = 'cod_auditoria';

    protected $fillable = [
        'user_id',
        'cod_cliente',
        'fecha_aud',
        'modulo_aud',
        'submodulo_aud',
        'tabla_aud',
        'id_registro_aud',
        'accion_aud',
        'accion_funcional_aud',
        'descripcion_aud',
        'campo_aud',
        'valor_anterior_aud',
        'valor_nuevo_aud',
        'metodo_http_aud',
        'ip_aud',
        'user_agent_aud',
        'dispositivo_aud',
        'navegador_aud',
        'sistema_operativo_aud',
        'id_evento_aud',
    ];

    protected $casts = [
        'fecha_aud' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cod_cliente', 'cod_cliente');
    }
}
