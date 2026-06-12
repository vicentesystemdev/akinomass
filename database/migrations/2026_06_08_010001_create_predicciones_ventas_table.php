<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('predicciones_ventas', function (Blueprint $table): void {
            $table->id('cod_prediccion_venta');
            $table->string('codigo_prediccion')->unique();
            $table->date('periodo_inicio');
            $table->date('periodo_fin');
            $table->string('tipo_periodo', 20);
            $table->foreignId('cod_categoria_producto')->nullable()->constrained('categorias_producto', 'cod_categoria_producto')->nullOnDelete();
            $table->foreignId('cod_producto')->nullable()->constrained('productos', 'cod_producto')->nullOnDelete();
            $table->foreignId('cod_variante_producto')->nullable()->constrained('variantes_producto', 'cod_variante_producto')->nullOnDelete();
            $table->foreignId('cod_talla_producto')->nullable()->constrained('tallas_producto', 'cod_talla_producto')->nullOnDelete();
            $table->foreignId('cod_canal_venta')->nullable()->constrained('canales_venta', 'cod_canal_venta')->nullOnDelete();
            $table->string('estado_demanda_actual', 20);
            $table->string('estado_demanda_predicho', 20);
            $table->decimal('probabilidad_baja', 8, 4)->default(0);
            $table->decimal('probabilidad_media', 8, 4)->default(0);
            $table->decimal('probabilidad_alta', 8, 4)->default(0);
            $table->integer('ventas_ultimos_30_dias')->default(0);
            $table->integer('ventas_ultimos_60_dias')->default(0);
            $table->integer('ventas_ultimos_90_dias')->default(0);
            $table->integer('ventas_periodo')->default(0);
            $table->decimal('promedio_ventas_periodo', 12, 2)->default(0);
            $table->decimal('tendencia_porcentual', 12, 2)->default(0);
            $table->decimal('indice_demanda_relativa', 12, 4)->default(0);
            $table->decimal('participacion_categoria', 12, 4)->default(0);
            $table->decimal('participacion_canal', 12, 4)->default(0);
            $table->decimal('variacion_vs_promedio_historico', 12, 2)->default(0);
            $table->decimal('variacion_vs_promedio_categoria', 12, 2)->default(0);
            $table->decimal('rotacion_stock', 12, 4)->default(0);
            $table->decimal('ratio_cobertura', 12, 4)->default(0);
            $table->integer('ventas_estimadas_proximo_periodo')->default(0);
            $table->integer('rango_estimado_minimo')->default(0);
            $table->integer('rango_estimado_maximo')->default(0);
            $table->integer('stock_actual')->default(0);
            $table->decimal('porcentaje_stock_seguridad', 8, 2)->default(0);
            $table->integer('stock_seguridad_dinamico')->default(0);
            $table->integer('cantidad_sugerida_abastecimiento')->default(0);
            $table->decimal('precio_promedio_venta', 12, 2)->default(0);
            $table->decimal('ingreso_estimado', 14, 2)->default(0);
            $table->string('canal_dominante')->nullable();
            $table->decimal('porcentaje_canal_dominante', 12, 4)->nullable();
            $table->string('nivel_riesgo_stock', 20);
            $table->string('nivel_recomendacion', 20);
            $table->string('nivel_confianza', 20);
            $table->decimal('puntaje', 12, 4)->default(0);
            $table->text('motivo')->nullable();
            $table->json('parametros')->nullable();
            $table->timestamps();

            $table->index(['cod_producto', 'cod_categoria_producto']);
            $table->index(['nivel_recomendacion', 'nivel_riesgo_stock']);
            $table->index(['periodo_inicio', 'periodo_fin']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predicciones_ventas');
    }
};
