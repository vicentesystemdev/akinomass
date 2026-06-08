<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VentaRedDetalle extends Model
{
    use HasFactory;

    protected $table = 'venta_red_detalles';

    protected $primaryKey = 'cod_venta_red_detalle';

    protected $fillable = [
        'cod_venta_red',
        'cod_producto',
        'cod_variante_producto',
        'cod_talla_producto',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'observacion',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function ventaRed(): BelongsTo
    {
        return $this->belongsTo(VentaRed::class, 'cod_venta_red', 'cod_venta_red');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'cod_producto', 'cod_producto');
    }

    public function variante(): BelongsTo
    {
        return $this->belongsTo(VarianteProducto::class, 'cod_variante_producto', 'cod_variante_producto');
    }

    public function talla(): BelongsTo
    {
        return $this->belongsTo(TallaProducto::class, 'cod_talla_producto', 'cod_talla_producto');
    }
}
