<?php

namespace App\Models;

use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $primaryKey = 'cod_producto';

    protected $fillable = [
        'cod_categoria_producto',
        'nombre_pro',
        'descripcion_pro',
        'precio_venta_pro',
        'precio_costo_pro',
        'sku_pro',
        'imagen_pro',
        'estado_pro',
    ];

    protected $casts = [
        'precio_venta_pro' => 'decimal:2',
        'precio_costo_pro' => 'decimal:2',
        'estado_pro' => EstadoProductoEnum::class,
    ];

    protected $appends = ['image_url'];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaProducto::class, 'cod_categoria_producto', 'cod_categoria_producto');
    }

    public function inventario(): HasOne
    {
        return $this->hasOne(Inventario::class, 'cod_producto', 'cod_producto');
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->imagen_pro) {
            return null;
        }

        return asset('storage/' . $this->imagen_pro);
    }
}
