<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuracion_inteligencia_ventas', function (Blueprint $table): void {
            $table->id('cod_configuracion_inteligencia_ventas');
            $table->unsignedInteger('dias_analisis')->default(90);
            $table->string('periodo_agrupacion', 20)->default('mensual');
            $table->decimal('umbral_indice_demanda_baja', 8, 4)->default(0.70);
            $table->decimal('umbral_indice_demanda_alta', 8, 4)->default(1.20);
            $table->decimal('porcentaje_stock_seguridad', 8, 2)->default(20);
            $table->unsignedInteger('stock_seguridad_minimo')->default(1);
            $table->decimal('limite_factor_tendencia_min', 8, 4)->default(0.70);
            $table->decimal('limite_factor_tendencia_max', 8, 4)->default(1.40);
            $table->decimal('peso_transicion_demanda', 8, 4)->default(0.40);
            $table->decimal('peso_tendencia', 8, 4)->default(0.25);
            $table->decimal('peso_rotacion', 8, 4)->default(0.20);
            $table->decimal('peso_canal', 8, 4)->default(0.15);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuracion_inteligencia_ventas');
    }
};
