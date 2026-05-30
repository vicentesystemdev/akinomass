<?php

namespace App\Models;

use App\Domains\Tienda\Facturacion\Enums\EstadoFacturaEnum;
use App\Domains\Tienda\Facturacion\Enums\TipoComprobanteEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Factura extends Model
{
    use HasFactory;

    protected $table = 'facturas';

    protected $primaryKey = 'cod_factura';

    protected $fillable = [
        'cod_pedido',
        'cod_pago',
        'cod_checkout_sesion',
        'numero_factura_fac',
        'tipo_comprobante_fac',
        'estado_fac',
        'fecha_emision_fac',
        'documento_cliente_fac',
        'razon_social_cliente_fac',
        'direccion_fiscal_fac',
        'subtotal_fac',
        'descuento_fac',
        'impuesto_fac',
        'total_fac',
        'moneda_fac',
        'codigo_control_fac',
        'observacion_fac',
        'emitida_por_user_id',
        'anulada_en_fac',
    ];

    protected function casts(): array
    {
        return [
            'tipo_comprobante_fac' => TipoComprobanteEnum::class,
            'estado_fac' => EstadoFacturaEnum::class,
            'fecha_emision_fac' => 'date',
            'subtotal_fac' => 'decimal:2',
            'descuento_fac' => 'decimal:2',
            'impuesto_fac' => 'decimal:2',
            'total_fac' => 'decimal:2',
            'anulada_en_fac' => 'datetime',
        ];
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'cod_pedido', 'cod_pedido');
    }

    public function pago(): BelongsTo
    {
        return $this->belongsTo(Pago::class, 'cod_pago', 'cod_pago');
    }

    public function checkoutSesion(): BelongsTo
    {
        return $this->belongsTo(CheckoutSesion::class, 'cod_checkout_sesion', 'cod_checkout_sesion');
    }

    public function emitidaPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'emitida_por_user_id', 'id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleFactura::class, 'cod_factura', 'cod_factura');
    }
}
