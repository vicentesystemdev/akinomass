<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetallePedido extends Model
{
    use HasFactory;

    protected $table = 'detalles_pedido';

    protected $primaryKey = 'cod_detalle_pedido';

    protected $fillable = ['cod_pedido', 'cod_producto', 'cod_variante_producto', 'cantidad_det', 'precio_unitario_det', 'subtotal_det'];

    protected $casts = ['precio_unitario_det' => 'decimal:2', 'subtotal_det' => 'decimal:2'];

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'cod_pedido', 'cod_pedido');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'cod_producto', 'cod_producto');
    }

    public function variante(): BelongsTo
    {
        return $this->belongsTo(VarianteProducto::class, 'cod_variante_producto', 'cod_variante_producto');
    }
}
