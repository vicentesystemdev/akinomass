<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos_tienda', function (Blueprint $table) {
            $table->bigIncrements('cod_pedido_tienda');
            $table->unsignedBigInteger('cod_pedido');
            $table->foreign('cod_pedido')->references('cod_pedido')->on('pedidos')->cascadeOnDelete();
            $table->unsignedBigInteger('cod_checkout_sesion');
            $table->foreign('cod_checkout_sesion')->references('cod_checkout_sesion')->on('checkout_sesiones')->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('cod_cuenta_cliente');
            $table->foreign('cod_cuenta_cliente')->references('cod_cuenta_cliente')->on('cuentas_cliente')->restrictOnDelete();
            $table->string('session_id_pte', 100)->nullable();
            $table->string('ip_origen_pte', 45)->nullable();
            $table->text('user_agent_pte')->nullable();
            $table->string('estado_pte', 20)->default('pendiente_pago')->index();
            $table->timestamps();

            $table->unique('cod_pedido');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos_tienda');
    }
};
