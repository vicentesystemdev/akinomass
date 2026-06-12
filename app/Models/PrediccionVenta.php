<?php

namespace App\Models;

use App\Domains\InteligenciaVentas\Enums\EstadoDemandaEnum;
use App\Domains\InteligenciaVentas\Enums\NivelConfianzaPrediccionEnum;
use App\Domains\InteligenciaVentas\Enums\NivelRecomendacionAbastecimientoEnum;
use App\Domains\InteligenciaVentas\Enums\NivelRiesgoStockEnum;
use App\Domains\InteligenciaVentas\Enums\TipoPeriodoAnalisisEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrediccionVenta extends Model
{
    use HasFactory;

    protected $table = 'predicciones_ventas';

    protected $primaryKey = 'cod_prediccion_venta';

    protected $guarded = [];

    protected $casts = [
        'periodo_inicio' => 'date',
        'periodo_fin' => 'date',
        'tipo_periodo' => TipoPeriodoAnalisisEnum::class,
        'estado_demanda_actual' => EstadoDemandaEnum::class,
        'estado_demanda_predicho' => EstadoDemandaEnum::class,
        'nivel_riesgo_stock' => NivelRiesgoStockEnum::class,
        'nivel_recomendacion' => NivelRecomendacionAbastecimientoEnum::class,
        'nivel_confianza' => NivelConfianzaPrediccionEnum::class,
        'parametros' => 'array',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaProducto::class, 'cod_categoria_producto', 'cod_categoria_producto');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'cod_producto', 'cod_producto');
    }

    public function variante(): BelongsTo
    {
        return $this->belongsTo(VarianteProducto::class, 'cod_variante_producto', 'cod_variante_producto');
    }

    public function talla(): BelongsTo
    {
        return $this->belongsTo(TallaProducto::class, 'cod_talla_producto', 'cod_talla_producto');
    }

    public function canalVenta(): BelongsTo
    {
        return $this->belongsTo(CanalVenta::class, 'cod_canal_venta', 'cod_canal_venta');
    }
}
