<?php

namespace App\Models;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carrito extends Model
{
    use HasFactory;

    protected $table = 'carritos';

    protected $primaryKey = 'cod_carrito';

    protected $fillable = [
        'user_id',
        'session_id_car',
        'cod_cliente',
        'estado_car',
        'moneda_car',
        'subtotal_car',
        'total_car',
        'expira_en_car',
    ];

    protected function casts(): array
    {
        return [
            'estado_car' => EstadoCarritoEnum::class,
            'subtotal_car' => 'decimal:2',
            'total_car' => 'decimal:2',
            'expira_en_car' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cod_cliente', 'cod_cliente');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleCarrito::class, 'cod_carrito', 'cod_carrito');
    }
}
