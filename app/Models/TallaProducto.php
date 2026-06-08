<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TallaProducto extends Model
{
    use HasFactory;

    protected $table = 'tallas_producto';

    protected $primaryKey = 'cod_talla_producto';

    public $incrementing = true;

    protected $fillable = [
        'codigo_talla_producto',
        'nom_talla_producto',
        'tipo_talla_producto',
        'orden_talla_producto',
        'activo_talla_producto',
    ];

    protected $casts = [
        'orden_talla_producto' => 'integer',
        'activo_talla_producto' => 'boolean',
    ];

    public function variantes(): HasMany
    {
        return $this->hasMany(VarianteProducto::class, 'cod_talla_producto', 'cod_talla_producto');
    }
}
