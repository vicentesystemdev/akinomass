<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('canales_venta', function (Blueprint $table): void {
            $table->bigIncrements('cod_canal_venta');
            $table->string('nombre_can');
            $table->string('codigo_can')->unique();
            $table->text('descripcion_can')->nullable();
            $table->boolean('activo_can')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('canales_venta');
    }
};
