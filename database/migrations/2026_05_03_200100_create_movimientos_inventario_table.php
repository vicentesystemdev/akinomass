<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos_inventario', function (Blueprint $table) {
            $table->id('cod_movimiento_inventario');
            $table->unsignedBigInteger('cod_inventario');
            $table->unsignedBigInteger('cod_producto');
            $table->string('tipo_movimiento_mov');
            $table->integer('cantidad_mov');
            $table->integer('stock_anterior_mov');
            $table->integer('stock_nuevo_mov');
            $table->string('motivo_mov', 255);
            $table->text('observacion_mov')->nullable();
            $table->foreignId('cod_usuario_responsable')->nullable()->constrained('users');
            $table->timestamps();

            $table->foreign('cod_inventario')->references('cod_inventario')->on('inventarios');
            $table->foreign('cod_producto')->references('cod_producto')->on('productos');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos_inventario');
    }
};
