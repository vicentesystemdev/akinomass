<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carritos', function (Blueprint $table) {
            $table->bigIncrements('cod_carrito');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id_car', 100)->nullable()->index();
            $table->unsignedBigInteger('cod_cliente')->nullable();
            $table->foreign('cod_cliente')->references('cod_cliente')->on('clientes')->nullOnDelete();
            $table->string('estado_car', 20)->default('activo')->index();
            $table->string('moneda_car', 3)->default('BOB');
            $table->decimal('subtotal_car', 12, 2)->default(0);
            $table->decimal('total_car', 12, 2)->default(0);
            $table->timestamp('expira_en_car')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carritos');
    }
};
