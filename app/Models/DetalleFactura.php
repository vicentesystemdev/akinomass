<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleFactura extends Model
{
    use HasFactory;

    protected $table = 'detalles_factura';

    protected $primaryKey = 'cod_detalle_factura';

    protected $fillable = [
        'cod_factura',
        'cod_producto',
        'cod_detalle_pedido',
        'descripcion_dfa',
        'cantidad_dfa',
        'precio_unitario_dfa',
        'subtotal_dfa',
    ];

    protected function casts(): array
    {
        return [
            'cantidad_dfa' => 'integer',
            'precio_unitario_dfa' => 'decimal:2',
            'subtotal_dfa' => 'decimal:2',
        ];
    }

    public function factura(): BelongsTo
    {
        return $this->belongsTo(Factura::class, 'cod_factura', 'cod_factura');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'cod_producto', 'cod_producto');
    }

    public function detallePedido(): BelongsTo
    {
        return $this->belongsTo(DetallePedido::class, 'cod_detalle_pedido', 'cod_detalle_pedido');
    }
}
