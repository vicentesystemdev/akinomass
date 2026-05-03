<?php

namespace App\Models;

use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedidos';
    protected $primaryKey = 'cod_pedido';

    protected $fillable = [
        'cod_cliente','cod_canal_venta','cod_tipo_flujo_comercial','cod_usuario_responsable','numero_pedido_ped','fecha_pedido_ped','estado_ped','subtotal_ped','descuento_ped','total_ped','observacion_ped',
    ];

    protected $casts = [
        'fecha_pedido_ped' => 'date',
        'estado_ped' => EstadoPedidoEnum::class,
        'subtotal_ped' => 'decimal:2',
        'descuento_ped' => 'decimal:2',
        'total_ped' => 'decimal:2',
    ];

    public function cliente(): BelongsTo { return $this->belongsTo(Cliente::class, 'cod_cliente', 'cod_cliente'); }
    public function canalVenta(): BelongsTo { return $this->belongsTo(CanalVenta::class, 'cod_canal_venta', 'cod_canal_venta'); }
    public function tipoFlujoComercial(): BelongsTo { return $this->belongsTo(TipoFlujoComercial::class, 'cod_tipo_flujo_comercial', 'cod_tipo_flujo_comercial'); }
    public function usuarioResponsable(): BelongsTo { return $this->belongsTo(User::class, 'cod_usuario_responsable'); }
    public function detalles(): HasMany { return $this->hasMany(DetallePedido::class, 'cod_pedido', 'cod_pedido'); }
}
