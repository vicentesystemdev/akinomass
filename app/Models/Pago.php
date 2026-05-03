<?php

namespace App\Models;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Enums\MetodoPagoEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pago extends Model
{
    use HasFactory;

    protected $table = 'pagos';
    protected $primaryKey = 'cod_pago';

    protected $fillable = [
        'cod_pedido',
        'cod_usuario_responsable',
        'metodo_pago_pag',
        'estado_pago_pag',
        'monto_pag',
        'referencia_pag',
        'fecha_pago_pag',
        'observacion_pag',
    ];

    protected $casts = [
        'metodo_pago_pag' => MetodoPagoEnum::class,
        'estado_pago_pag' => EstadoPagoEnum::class,
        'monto_pag' => 'decimal:2',
        'fecha_pago_pag' => 'date',
    ];

    public function pedido(): BelongsTo { return $this->belongsTo(Pedido::class, 'cod_pedido', 'cod_pedido'); }
    public function usuarioResponsable(): BelongsTo { return $this->belongsTo(User::class, 'cod_usuario_responsable'); }
}
