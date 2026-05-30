<?php

namespace App\Models;

use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PedidoTienda extends Model
{
    use HasFactory;

    protected $table = 'pedidos_tienda';

    protected $primaryKey = 'cod_pedido_tienda';

    protected $fillable = [
        'cod_pedido',
        'cod_checkout_sesion',
        'user_id',
        'cod_cuenta_cliente',
        'session_id_pte',
        'ip_origen_pte',
        'user_agent_pte',
        'estado_pte',
    ];

    protected function casts(): array
    {
        return [
            'estado_pte' => EstadoPedidoTiendaEnum::class,
        ];
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'cod_pedido', 'cod_pedido');
    }

    public function checkoutSesion(): BelongsTo
    {
        return $this->belongsTo(CheckoutSesion::class, 'cod_checkout_sesion', 'cod_checkout_sesion');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function cuentaCliente(): BelongsTo
    {
        return $this->belongsTo(CuentaCliente::class, 'cod_cuenta_cliente', 'cod_cuenta_cliente');
    }

    public function pagoTienda(): HasOne
    {
        return $this->hasOne(PagoTienda::class, 'cod_checkout_sesion', 'cod_checkout_sesion');
    }

    public function pago(): HasOne
    {
        return $this->hasOne(Pago::class, 'cod_pedido', 'cod_pedido');
    }

    public function factura(): HasOne
    {
        return $this->hasOne(Factura::class, 'cod_pedido', 'cod_pedido');
    }
}
