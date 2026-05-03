<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoFlujoComercial extends Model
{
    use HasFactory;

    protected $table = 'tipos_flujo_comercial';

    protected $primaryKey = 'cod_tipo_flujo_comercial';

    protected $fillable = [
        'nombre_tip',
        'codigo_tip',
        'descripcion_tip',
        'activo_tip',
    ];

    protected $casts = [
        'activo_tip' => 'boolean',
    ];
}
