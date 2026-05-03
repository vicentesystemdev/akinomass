<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    use HasFactory;

    protected $table = 'leads';

    protected $primaryKey = 'cod_lead';

    protected $fillable = [
        'nombre_lea',
        'alias_lea',
        'telefono_lea',
        'correo_lea',
        'producto_interes_lea',
        'observacion_lea',
        'estado_lea',
        'fecha_seguimiento_lea',
        'cod_canal_venta',
        'cod_tipo_flujo_comercial',
        'cod_cliente',
        'cod_usuario_responsable',
    ];

    protected $casts = [
        'fecha_seguimiento_lea' => 'date',
    ];

    public function canalVenta(): BelongsTo
    {
        return $this->belongsTo(CanalVenta::class, 'cod_canal_venta', 'cod_canal_venta');
    }

    public function tipoFlujoComercial(): BelongsTo
    {
        return $this->belongsTo(TipoFlujoComercial::class, 'cod_tipo_flujo_comercial', 'cod_tipo_flujo_comercial');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cod_cliente', 'cod_cliente');
    }

    public function usuarioResponsable(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cod_usuario_responsable', 'id');
    }
}
