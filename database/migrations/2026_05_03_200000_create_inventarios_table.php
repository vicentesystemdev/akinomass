<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventarios', function (Blueprint $table) {
            $table->id('cod_inventario');
            $table->unsignedBigInteger('cod_producto');
            $table->integer('stock_actual_inv')->default(0);
            $table->integer('stock_minimo_inv')->default(0);
            $table->string('ubicacion_inv')->nullable();
            $table->boolean('activo_inv')->default(true);
            $table->timestamps();

            $table->foreign('cod_producto')->references('cod_producto')->on('productos');

            if (Schema::getConnection()->getDriverName() !== 'sqlite') {
                $table->unique('cod_producto');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventarios');
    }
};
