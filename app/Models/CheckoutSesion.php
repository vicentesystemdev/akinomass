<?php

namespace App\Models;

use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class CheckoutSesion extends Model
{
    use HasFactory;

    protected $table = 'checkout_sesiones';

    protected $primaryKey = 'cod_checkout_sesion';

    protected $fillable = [
        'cod_cuenta_cliente',
        'cod_carrito',
        'cod_direccion_cliente',
        'estado_che',
        'email_contacto_che',
        'telefono_contacto_che',
        'direccion_entrega_che',
        'documento_facturacion_che',
        'razon_social_che',
        'subtotal_che',
        'descuento_che',
        'impuesto_che',
        'total_che',
        'metodo_pago_elegido_che',
        'referencia_pago_che',
        'comprobante_ruta_che',
        'token_che',
        'expira_en_che',
        'completado_en_che',
    ];

    protected function casts(): array
    {
        return [
            'estado_che' => EstadoCheckoutSesionEnum::class,
            'subtotal_che' => 'decimal:2',
            'descuento_che' => 'decimal:2',
            'impuesto_che' => 'decimal:2',
            'total_che' => 'decimal:2',
            'expira_en_che' => 'datetime',
            'completado_en_che' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->token_che)) {
                $model->token_che = (string) Str::uuid();
            }
        });
    }

    public function cuentaCliente(): BelongsTo
    {
        return $this->belongsTo(CuentaCliente::class, 'cod_cuenta_cliente', 'cod_cuenta_cliente');
    }

    public function carrito(): BelongsTo
    {
        return $this->belongsTo(Carrito::class, 'cod_carrito', 'cod_carrito');
    }

    public function direccionCliente(): BelongsTo
    {
        return $this->belongsTo(DireccionCliente::class, 'cod_direccion_cliente', 'cod_direccion_cliente');
    }

    public function pedidoTienda(): HasOne
    {
        return $this->hasOne(PedidoTienda::class, 'cod_checkout_sesion', 'cod_checkout_sesion');
    }

    public function estaExpirado(): bool
    {
        return $this->expira_en_che && $this->expira_en_che->isPast();
    }

    public function puedeTransicionarA(EstadoCheckoutSesionEnum $nuevoEstado): bool
    {
        $transicionesPermitidas = [
            EstadoCheckoutSesionEnum::INICIADO => [
                EstadoCheckoutSesionEnum::DATOS_COMPLETADOS,
                EstadoCheckoutSesionEnum::CANCELADO,
                EstadoCheckoutSesionEnum::EXPIRADO,
            ],
            EstadoCheckoutSesionEnum::DATOS_COMPLETADOS => [
                EstadoCheckoutSesionEnum::PEDIDO_GENERADO,
                EstadoCheckoutSesionEnum::CANCELADO,
            ],
            EstadoCheckoutSesionEnum::PEDIDO_GENERADO => [
                EstadoCheckoutSesionEnum::PAGO_REGISTRADO,
            ],
            EstadoCheckoutSesionEnum::PAGO_REGISTRADO => [
                EstadoCheckoutSesionEnum::PAGO_CONFIRMADO,
            ],
            EstadoCheckoutSesionEnum::PAGO_CONFIRMADO => [
                EstadoCheckoutSesionEnum::COMPLETADO,
            ],
        ];

        return in_array(
            $nuevoEstado,
            $transicionesPermitidas[$this->estado_che] ?? []
        );
    }
}
