<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConfiguracionTienda extends Model
{
    use HasFactory;

    protected $table = 'configuraciones_tienda';

    protected $primaryKey = 'cod_configuracion_tienda';

    protected $fillable = [
        'clave_cti',
        'valor_cti',
        'tipo_cti',
        'descripcion_cti',
        'activo_cti',
        'actualizado_por_user_id',
    ];

    protected function casts(): array
    {
        return [
            'activo_cti' => 'boolean',
        ];
    }

    public function actualizadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actualizado_por_user_id', 'id');
    }
}
