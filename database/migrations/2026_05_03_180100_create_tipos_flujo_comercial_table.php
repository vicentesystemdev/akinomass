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
        Schema::create('tipos_flujo_comercial', function (Blueprint $table): void {
            $table->bigIncrements('cod_tipo_flujo_comercial');
            $table->string('nombre_tip');
            $table->string('codigo_tip')->unique();
            $table->text('descripcion_tip')->nullable();
            $table->boolean('activo_tip')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_flujo_comercial');
    }
};
