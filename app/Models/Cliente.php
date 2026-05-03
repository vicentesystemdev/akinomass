<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';

    protected $primaryKey = 'cod_cliente';

    protected $fillable = [
        'nombre_cli',
        'telefono_cli',
        'correo_cli',
        'direccion_cli',
        'documento_cli',
        'observacion_cli',
        'estado_cli',
        'cod_canal_venta',
        'cod_tipo_flujo_comercial',
    ];

    public function canalVenta(): BelongsTo
    {
        return $this->belongsTo(CanalVenta::class, 'cod_canal_venta', 'cod_canal_venta');
    }

    public function tipoFlujoComercial(): BelongsTo
    {
        return $this->belongsTo(TipoFlujoComercial::class, 'cod_tipo_flujo_comercial', 'cod_tipo_flujo_comercial');
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'cod_cliente', 'cod_cliente');
    }
}
