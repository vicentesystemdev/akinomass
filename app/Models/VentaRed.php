<?php

namespace App\Models;

use App\Domains\VentasRedes\Enums\EstadoVentaRedEnum;
use App\Domains\VentasRedes\Enums\TipoInteraccionVentaRedEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VentaRed extends Model
{
    use HasFactory;

    protected $table = 'ventas_redes';

    protected $primaryKey = 'cod_venta_red';

    protected $fillable = [
        'codigo_venta_red',
        'cod_lead',
        'cod_cliente',
        'cod_canal_venta',
        'cod_tipo_flujo_comercial',
        'cod_usuario_responsable',
        'estado_venta_red',
        'tipo_interaccion',
        'referencia_origen',
        'observacion',
        'subtotal',
        'descuento',
        'total',
        'cod_checkout_sesion',
        'cod_pedido',
        'fecha_confirmacion',
    ];

    protected $casts = [
        'estado_venta_red' => EstadoVentaRedEnum::class,
        'tipo_interaccion' => TipoInteraccionVentaRedEnum::class,
        'subtotal' => 'decimal:2',
        'descuento' => 'decimal:2',
        'total' => 'decimal:2',
        'fecha_confirmacion' => 'datetime',
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class, 'cod_lead', 'cod_lead');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cod_cliente', 'cod_cliente');
    }

    public function canalVenta(): BelongsTo
    {
        return $this->belongsTo(CanalVenta::class, 'cod_canal_venta', 'cod_canal_venta');
    }

    public function tipoFlujoComercial(): BelongsTo
    {
        return $this->belongsTo(TipoFlujoComercial::class, 'cod_tipo_flujo_comercial', 'cod_tipo_flujo_comercial');
    }

    public function usuarioResponsable(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cod_usuario_responsable', 'id');
    }

    public function checkoutSesion(): BelongsTo
    {
        return $this->belongsTo(CheckoutSesion::class, 'cod_checkout_sesion', 'cod_checkout_sesion');
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'cod_pedido', 'cod_pedido');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(VentaRedDetalle::class, 'cod_venta_red', 'cod_venta_red');
    }
}
