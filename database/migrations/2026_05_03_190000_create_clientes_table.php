<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->bigIncrements('cod_cliente');
            $table->string('nombre_cli');
            $table->string('telefono_cli')->nullable();
            $table->string('correo_cli')->nullable();
            $table->string('direccion_cli')->nullable();
            $table->string('documento_cli')->nullable();
            $table->text('observacion_cli')->nullable();
            $table->string('estado_cli');
            $table->unsignedBigInteger('cod_canal_venta');
            $table->unsignedBigInteger('cod_tipo_flujo_comercial');
            $table->timestamps();

            $table->foreign('cod_canal_venta')->references('cod_canal_venta')->on('canales_venta');
            $table->foreign('cod_tipo_flujo_comercial')->references('cod_tipo_flujo_comercial')->on('tipos_flujo_comercial');
            $table->index('estado_cli');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
