<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CanalVenta extends Model
{
    use HasFactory;

    protected $table = 'canales_venta';

    protected $primaryKey = 'cod_canal_venta';

    protected $fillable = [
        'nombre_can',
        'codigo_can',
        'descripcion_can',
        'activo_can',
    ];

    protected $casts = [
        'activo_can' => 'boolean',
    ];
}
