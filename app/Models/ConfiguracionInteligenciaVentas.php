<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfiguracionInteligenciaVentas extends Model
{
    use HasFactory;

    protected $table = 'configuracion_inteligencia_ventas';

    protected $primaryKey = 'cod_configuracion_inteligencia_ventas';

    protected $fillable = [
        'dias_analisis',
        'periodo_agrupacion',
        'umbral_indice_demanda_baja',
        'umbral_indice_demanda_alta',
        'porcentaje_stock_seguridad',
        'stock_seguridad_minimo',
        'limite_factor_tendencia_min',
        'limite_factor_tendencia_max',
        'peso_transicion_demanda',
        'peso_tendencia',
        'peso_rotacion',
        'peso_canal',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'umbral_indice_demanda_baja' => 'decimal:4',
        'umbral_indice_demanda_alta' => 'decimal:4',
        'porcentaje_stock_seguridad' => 'decimal:2',
        'limite_factor_tendencia_min' => 'decimal:4',
        'limite_factor_tendencia_max' => 'decimal:4',
        'peso_transicion_demanda' => 'decimal:4',
        'peso_tendencia' => 'decimal:4',
        'peso_rotacion' => 'decimal:4',
        'peso_canal' => 'decimal:4',
    ];
}
