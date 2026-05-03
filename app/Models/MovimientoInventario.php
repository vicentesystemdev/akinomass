<?php

namespace App\Models;

use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimientoInventario extends Model
{
    use HasFactory;

    protected $table = 'movimientos_inventario';

    protected $primaryKey = 'cod_movimiento_inventario';

    protected $fillable = [
        'cod_inventario','cod_producto','tipo_movimiento_mov','cantidad_mov','stock_anterior_mov','stock_nuevo_mov','motivo_mov','observacion_mov','cod_usuario_responsable',
    ];

    protected $casts = ['tipo_movimiento_mov' => TipoMovimientoInventarioEnum::class];

    public function inventario(): BelongsTo
    {
        return $this->belongsTo(Inventario::class, 'cod_inventario', 'cod_inventario');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'cod_producto', 'cod_producto');
    }

    public function usuarioResponsable(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cod_usuario_responsable');
    }
}
