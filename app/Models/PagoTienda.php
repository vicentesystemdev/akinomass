<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PagoTienda extends Model
{
    use HasFactory;

    protected $table = 'pagos_tienda';

    protected $primaryKey = 'cod_pago_tienda';

    protected $fillable = [
        'cod_pago',
        'cod_checkout_sesion',
        'user_id',
        'comprobante_ruta_pwe',
        'comprobante_hash_pwe',
        'banco_origen_pwe',
        'fecha_subida_comprobante_pwe',
        'intentos_pago_pwe',
        'metadata_pwe',
    ];

    protected function casts(): array
    {
        return [
            'fecha_subida_comprobante_pwe' => 'datetime',
            'metadata_pwe' => 'array',
            'intentos_pago_pwe' => 'integer',
        ];
    }

    public function pago(): BelongsTo
    {
        return $this->belongsTo(Pago::class, 'cod_pago', 'cod_pago');
    }

    public function checkoutSesion(): BelongsTo
    {
        return $this->belongsTo(CheckoutSesion::class, 'cod_checkout_sesion', 'cod_checkout_sesion');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function comprobantes(): HasMany
    {
        return $this->hasMany(ComprobantePagoTienda::class, 'cod_pago_tienda', 'cod_pago_tienda');
    }
}
