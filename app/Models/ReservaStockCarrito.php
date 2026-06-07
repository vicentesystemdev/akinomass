<?php

namespace App\Models;

use App\Domains\Tienda\Carrito\Enums\EstadoReservaStockEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservaStockCarrito extends Model
{
    use HasFactory;

    protected $table = 'reservas_stock_carrito';

    protected $primaryKey = 'cod_reserva_stock_carrito';

    protected $fillable = [
        'cod_carrito',
        'cod_detalle_carrito',
        'cod_producto',
        'user_id',
        'session_id_res',
        'cantidad_res',
        'estado_res',
        'expira_en_res',
        'confirmada_en_res',
        'liberada_en_res',
    ];

    protected function casts(): array
    {
        return [
            'estado_res' => EstadoReservaStockEnum::class,
            'expira_en_res' => 'datetime',
            'confirmada_en_res' => 'datetime',
            'liberada_en_res' => 'datetime',
        ];
    }

    public function carrito(): BelongsTo
    {
        return $this->belongsTo(Carrito::class, 'cod_carrito', 'cod_carrito');
    }

    public function detalleCarrito(): BelongsTo
    {
        return $this->belongsTo(DetalleCarrito::class, 'cod_detalle_carrito', 'cod_detalle_carrito');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'cod_producto', 'cod_producto');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
