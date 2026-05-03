<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalles_pedido', function (Blueprint $table) {
            $table->id('cod_detalle_pedido');
            $table->foreignId('cod_pedido')->constrained('pedidos', 'cod_pedido')->cascadeOnDelete();
            $table->foreignId('cod_producto')->constrained('productos', 'cod_producto');
            $table->unsignedInteger('cantidad_det');
            $table->decimal('precio_unitario_det', 12, 2);
            $table->decimal('subtotal_det', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalles_pedido');
    }
};
