<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos_tienda', function (Blueprint $table) {
            $table->bigIncrements('cod_pago_tienda');
            $table->unsignedBigInteger('cod_pago');
            $table->foreign('cod_pago')->references('cod_pago')->on('pagos')->cascadeOnDelete();
            $table->unsignedBigInteger('cod_checkout_sesion');
            $table->foreign('cod_checkout_sesion')->references('cod_checkout_sesion')->on('checkout_sesiones')->restrictOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('comprobante_ruta_pwe', 255)->nullable();
            $table->string('comprobante_hash_pwe', 64)->nullable();
            $table->string('banco_origen_pwe', 100)->nullable();
            $table->timestamp('fecha_subida_comprobante_pwe')->nullable();
            $table->unsignedTinyInteger('intentos_pago_pwe')->default(0);
            $table->json('metadata_pwe')->nullable();
            $table->timestamps();

            $table->unique('cod_pago');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos_tienda');
    }
};
