<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalles_carrito', function (Blueprint $table) {
            $table->bigIncrements('cod_detalle_carrito');
            $table->unsignedBigInteger('cod_carrito');
            $table->foreign('cod_carrito')->references('cod_carrito')->on('carritos')->cascadeOnDelete();
            $table->unsignedBigInteger('cod_producto');
            $table->foreign('cod_producto')->references('cod_producto')->on('productos')->restrictOnDelete();
            $table->unsignedInteger('cantidad_dca');
            $table->decimal('precio_unitario_dca', 12, 2);
            $table->decimal('subtotal_dca', 12, 2);
            $table->string('nombre_producto_dca', 255)->nullable();
            $table->string('sku_producto_dca', 100)->nullable();
            $table->timestamps();

            if (Schema::getConnection()->getDriverName() !== 'sqlite') {
                $table->unique(['cod_carrito', 'cod_producto']);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalles_carrito');
    }
};
