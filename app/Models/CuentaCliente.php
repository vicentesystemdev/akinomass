<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CuentaCliente extends Model
{
    use HasFactory;

    protected $table = 'cuentas_cliente';
    protected $primaryKey = 'cod_cuenta_cliente';

    protected $fillable = [
        'user_id',
        'cod_cliente',
        'estado_cue',
        'fecha_activacion_cue',
    ];

    protected $casts = [
        'fecha_activacion_cue' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cod_cliente', 'cod_cliente');
    }
}
