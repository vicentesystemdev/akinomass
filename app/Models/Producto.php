<?php

namespace App\Models;

use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaProducto::class, 'cod_categoria_producto', 'cod_categoria_producto');
    }
}
