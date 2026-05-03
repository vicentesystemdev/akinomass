<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->bigIncrements('cod_lead');
            $table->string('nombre_lea');
            $table->string('alias_lea')->nullable();
            $table->string('telefono_lea')->nullable();
            $table->string('correo_lea')->nullable();
            $table->string('producto_interes_lea')->nullable();
            $table->text('observacion_lea')->nullable();
            $table->string('estado_lea');
            $table->date('fecha_seguimiento_lea')->nullable();
            $table->unsignedBigInteger('cod_canal_venta');
            $table->unsignedBigInteger('cod_tipo_flujo_comercial');
            $table->unsignedBigInteger('cod_cliente')->nullable();
            $table->unsignedBigInteger('cod_usuario_responsable')->nullable();
            $table->timestamps();

            $table->foreign('cod_canal_venta')->references('cod_canal_venta')->on('canales_venta');
            $table->foreign('cod_tipo_flujo_comercial')->references('cod_tipo_flujo_comercial')->on('tipos_flujo_comercial');
            $table->foreign('cod_cliente')->references('cod_cliente')->on('clientes')->nullOnDelete();
            $table->foreign('cod_usuario_responsable')->references('id')->on('users')->nullOnDelete();
            $table->index('estado_lea');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
