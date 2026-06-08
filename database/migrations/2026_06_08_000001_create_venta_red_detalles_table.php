<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venta_red_detalles', function (Blueprint $table): void {
            $table->id('cod_venta_red_detalle');
            $table->foreignId('cod_venta_red')->constrained('ventas_redes', 'cod_venta_red')->cascadeOnDelete();
            $table->foreignId('cod_producto')->constrained('productos', 'cod_producto')->restrictOnDelete();
            $table->foreignId('cod_variante_producto')->nullable()->constrained('variantes_producto', 'cod_variante_producto')->nullOnDelete();
            $table->foreignId('cod_talla_producto')->nullable()->constrained('tallas_producto', 'cod_talla_producto')->nullOnDelete();
            $table->integer('cantidad')->default(1);
            $table->decimal('precio_unitario', 12, 2);
            $table->decimal('subtotal', 12, 2);
            $table->text('observacion')->nullable();
            $table->timestamps();

            $table->index(['cod_producto', 'cod_variante_producto']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venta_red_detalles');
    }
};
