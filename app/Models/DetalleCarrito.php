<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleCarrito extends Model
{
    use HasFactory;

    protected $table = 'detalles_carrito';

    protected $primaryKey = 'cod_detalle_carrito';

    protected $fillable = [
        'cod_carrito',
        'cod_producto',
        'cantidad_dca',
        'precio_unitario_dca',
        'subtotal_dca',
        'nombre_producto_dca',
        'sku_producto_dca',
    ];

    protected function casts(): array
    {
        return [
            'cantidad_dca' => 'integer',
            'precio_unitario_dca' => 'decimal:2',
            'subtotal_dca' => 'decimal:2',
        ];
    }

    public function carrito(): BelongsTo
    {
        return $this->belongsTo(Carrito::class, 'cod_carrito', 'cod_carrito');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'cod_producto', 'cod_producto');
    }
}
