<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalles_factura', function (Blueprint $table) {
            $table->bigIncrements('cod_detalle_factura');
            $table->unsignedBigInteger('cod_factura');
            $table->foreign('cod_factura')->references('cod_factura')->on('facturas')->cascadeOnDelete();
            $table->unsignedBigInteger('cod_producto')->nullable();
            $table->foreign('cod_producto')->references('cod_producto')->on('productos')->nullOnDelete();
            $table->unsignedBigInteger('cod_detalle_pedido')->nullable();
            $table->foreign('cod_detalle_pedido')->references('cod_detalle_pedido')->on('detalles_pedido')->nullOnDelete();
            $table->string('descripcion_dfa', 255);
            $table->unsignedInteger('cantidad_dfa');
            $table->decimal('precio_unitario_dfa', 12, 2);
            $table->decimal('subtotal_dfa', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalles_factura');
    }
};
