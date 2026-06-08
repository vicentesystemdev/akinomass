<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservas_stock_carrito', function (Blueprint $table) {
            $table->bigIncrements('cod_reserva_stock_carrito');

            $table->unsignedBigInteger('cod_carrito');
            $table->unsignedBigInteger('cod_detalle_carrito')->nullable();
            $table->unsignedBigInteger('cod_producto');

            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('session_id_res', 100)->nullable();

            $table->unsignedInteger('cantidad_res');
            $table->string('estado_res', 30)->default('activa')->index();

            $table->timestamp('expira_en_res')->index();
            $table->timestamp('confirmada_en_res')->nullable();
            $table->timestamp('liberada_en_res')->nullable();

            $table->timestamps();

            $table->foreign('cod_carrito')->references('cod_carrito')->on('carritos')->cascadeOnDelete();
            $table->foreign('cod_detalle_carrito')->references('cod_detalle_carrito')->on('detalles_carrito')->nullOnDelete();
            $table->foreign('cod_producto')->references('cod_producto')->on('productos');

            $table->index(['cod_producto', 'estado_res', 'expira_en_res']);
            $table->index(['cod_carrito', 'estado_res']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas_stock_carrito');
    }
};
