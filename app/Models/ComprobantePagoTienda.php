<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComprobantePagoTienda extends Model
{
    use HasFactory;

    protected $table = 'comprobantes_pago_tienda';

    protected $primaryKey = 'cod_comprobante_pago_tienda';

    protected $fillable = [
        'cod_pago_tienda',
        'ruta_comprobante_cpt',
        'hash_comprobante_cpt',
        'mime_cpt',
        'tamano_bytes_cpt',
        'estado_cpt',
        'observacion_admin_cpt',
        'subido_por_user_id',
        'revisado_por_user_id',
        'subido_en_cpt',
        'revisado_en_cpt',
    ];

    protected function casts(): array
    {
        return [
            'subido_en_cpt' => 'datetime',
            'revisado_en_cpt' => 'datetime',
        ];
    }

    public function pagoTienda(): BelongsTo
    {
        return $this->belongsTo(PagoTienda::class, 'cod_pago_tienda', 'cod_pago_tienda');
    }

    public function subidoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'subido_por_user_id', 'id');
    }

    public function revisadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revisado_por_user_id', 'id');
    }
}
