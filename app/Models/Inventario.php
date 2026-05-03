<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventario extends Model
{
    use HasFactory;

    protected $table = 'inventarios';

    protected $primaryKey = 'cod_inventario';

    protected $fillable = ['cod_producto', 'stock_actual_inv', 'stock_minimo_inv', 'ubicacion_inv', 'activo_inv'];

    protected $casts = ['activo_inv' => 'boolean'];

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'cod_producto', 'cod_producto');
    }

    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'cod_inventario', 'cod_inventario');
    }
}
