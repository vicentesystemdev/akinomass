<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('checkout_sesiones', function (Blueprint $table) {
            $table->bigIncrements('cod_checkout_sesion');
            $table->unsignedBigInteger('cod_cuenta_cliente');
            $table->foreign('cod_cuenta_cliente')->references('cod_cuenta_cliente')->on('cuentas_cliente')->restrictOnDelete();
            $table->unsignedBigInteger('cod_carrito')->nullable();
            $table->foreign('cod_carrito')->references('cod_carrito')->on('carritos')->nullOnDelete();
            $table->unsignedBigInteger('cod_direccion_cliente')->nullable();
            $table->foreign('cod_direccion_cliente')->references('cod_direccion_cliente')->on('direcciones_cliente')->nullOnDelete();
            $table->string('estado_che', 30)->default('iniciado')->index();
            $table->string('email_contacto_che', 255);
            $table->string('telefono_contacto_che', 30)->nullable();
            $table->text('direccion_entrega_che')->nullable();
            $table->string('documento_facturacion_che', 30)->nullable();
            $table->string('razon_social_che', 255)->nullable();
            $table->decimal('subtotal_che', 12, 2)->default(0);
            $table->decimal('descuento_che', 12, 2)->default(0);
            $table->decimal('impuesto_che', 12, 2)->default(0);
            $table->decimal('total_che', 12, 2)->default(0);
            $table->string('metodo_pago_elegido_che', 30)->nullable();
            $table->string('referencia_pago_che', 150)->nullable();
            $table->string('comprobante_ruta_che', 255)->nullable();
            $table->uuid('token_che')->unique();
            $table->timestamp('expira_en_che')->nullable();
            $table->timestamp('completado_en_che')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checkout_sesiones');
    }
};
