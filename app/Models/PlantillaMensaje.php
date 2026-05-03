<?php

namespace App\Models;

use App\Domains\CRM\Plantillas\Enums\TipoPlantillaMensajeEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlantillaMensaje extends Model
{
    use HasFactory;

    protected $table = 'plantillas_mensaje';

    protected $primaryKey = 'cod_plantilla_mensaje';

    protected $fillable = [
        'nombre_pla',
        'tipo_pla',
        'contenido_pla',
        'activo_pla',
    ];

    protected $casts = [
        'tipo_pla' => TipoPlantillaMensajeEnum::class,
        'activo_pla' => 'boolean',
    ];

    public function scopeActivas(Builder $query): Builder
    {
        return $query->where('activo_pla', true);
    }
}
