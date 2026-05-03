<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;use Illuminate\Database\Eloquent\Relations\BelongsTo;
class ProductoLive extends Model { protected $table='productos_live'; protected $primaryKey='cod_producto_live'; protected $fillable=['cod_sesion_live','cod_producto','orden_proliv','precio_live_proliv','observacion_proliv']; protected $casts=['precio_live_proliv'=>'decimal:2']; public function sesionLive():BelongsTo{return $this->belongsTo(SesionLive::class,'cod_sesion_live','cod_sesion_live');} public function producto():BelongsTo{return $this->belongsTo(Producto::class,'cod_producto','cod_producto');}}
