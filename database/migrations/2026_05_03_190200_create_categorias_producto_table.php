<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorias_producto', function (Blueprint $table): void {
            $table->id('cod_categoria_producto');
            $table->string('nombre_cat', 255);
            $table->text('descripcion_cat')->nullable();
            $table->boolean('activo_cat')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorias_producto');
    }
};
