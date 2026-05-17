<?php
namespace App\Models;
use App\Domains\Comercial\LiveSales\Enums\EstadoInteraccionLiveEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InteraccionLive extends Model 
{ 
    protected $table='interacciones_live'; 
    protected $primaryKey='cod_interaccion_live'; 
    protected $fillable=['cod_sesion_live','cod_producto','alias_int','nombre_int','telefono_int','observacion_int','intencion_compra_int','estado_int','cod_lead','cod_pedido','cod_usuario_responsable']; 
    protected $casts=['estado_int'=>EstadoInteraccionLiveEnum::class]; 
    
    public function sesionLive():BelongsTo{return $this->belongsTo(SesionLive::class,'cod_sesion_live','cod_sesion_live');} 
    public function producto():BelongsTo{return $this->belongsTo(Producto::class,'cod_producto','cod_producto');} 
    public function lead():BelongsTo{return $this->belongsTo(Lead::class,'cod_lead','cod_lead');} 
    public function pedido():BelongsTo{return $this->belongsTo(Pedido::class,'cod_pedido','cod_pedido');} 
    public function usuarioResponsable():BelongsTo{return $this->belongsTo(User::class,'cod_usuario_responsable','id');}}
