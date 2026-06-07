<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tallas_producto', function (Blueprint $table): void {
            $table->id('cod_talla_producto');
            $table->string('codigo_talla_producto', 30)->unique();
            $table->string('nom_talla_producto', 100);
            $table->string('tipo_talla_producto', 30)->index();
            $table->unsignedInteger('orden_talla_producto')->default(0);
            $table->boolean('activo_talla_producto')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tallas_producto');
    }
};
