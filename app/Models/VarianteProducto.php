<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VarianteProducto extends Model
{
    use HasFactory;

    protected $table = 'variantes_producto';

    protected $primaryKey = 'cod_variante_producto';

    public $incrementing = true;

    protected $fillable = [
        'cod_producto',
        'cod_talla_producto',
        'sku_variante_producto',
        'precio_venta_variante',
        'estado_variante_producto',
        'activo_variante_producto',
    ];

    protected $casts = [
        'precio_venta_variante' => 'decimal:2',
        'activo_variante_producto' => 'boolean',
    ];

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'cod_producto', 'cod_producto');
    }

    public function talla(): BelongsTo
    {
        return $this->belongsTo(TallaProducto::class, 'cod_talla_producto', 'cod_talla_producto');
    }

    public function inventarios(): HasMany
    {
        return $this->hasMany(Inventario::class, 'cod_variante_producto', 'cod_variante_producto');
    }

    public function inventario(): HasOne
    {
        return $this->hasOne(Inventario::class, 'cod_variante_producto', 'cod_variante_producto');
    }
}
