<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facturas', function (Blueprint $table) {
            $table->bigIncrements('cod_factura');
            $table->unsignedBigInteger('cod_pedido');
            $table->foreign('cod_pedido')->references('cod_pedido')->on('pedidos')->cascadeOnDelete();
            $table->unsignedBigInteger('cod_pago')->nullable();
            $table->foreign('cod_pago')->references('cod_pago')->on('pagos')->nullOnDelete();
            $table->unsignedBigInteger('cod_checkout_sesion')->nullable();
            $table->foreign('cod_checkout_sesion')->references('cod_checkout_sesion')->on('checkout_sesiones')->nullOnDelete();
            $table->string('numero_factura_fac', 30)->unique();
            $table->string('tipo_comprobante_fac', 20)->default('recibo')->index();
            $table->string('estado_fac', 20)->default('borrador')->index();
            $table->date('fecha_emision_fac');
            $table->string('documento_cliente_fac', 30);
            $table->string('razon_social_cliente_fac', 255);
            $table->text('direccion_fiscal_fac')->nullable();
            $table->decimal('subtotal_fac', 12, 2);
            $table->decimal('descuento_fac', 12, 2)->default(0);
            $table->decimal('impuesto_fac', 12, 2)->default(0);
            $table->decimal('total_fac', 12, 2);
            $table->string('moneda_fac', 3)->default('BOB');
            $table->string('codigo_control_fac', 100)->nullable();
            $table->text('observacion_fac')->nullable();
            $table->foreignId('emitida_por_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('anulada_en_fac')->nullable();
            $table->timestamps();

            $table->unique('cod_pedido');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
