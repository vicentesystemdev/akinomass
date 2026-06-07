<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('variantes_producto', function (Blueprint $table): void {
            $table->id('cod_variante_producto');
            $table->foreignId('cod_producto')
                ->constrained('productos', 'cod_producto')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('cod_talla_producto')
                ->constrained('tallas_producto', 'cod_talla_producto')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('sku_variante_producto', 100)->nullable()->unique();
            $table->decimal('precio_venta_variante', 12, 2)->nullable();
            $table->string('estado_variante_producto', 30)->default('activo')->index();
            $table->boolean('activo_variante_producto')->default(true);
            $table->timestamps();

            $table->unique(
                ['cod_producto', 'cod_talla_producto'],
                'variantes_producto_producto_talla_unique',
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('variantes_producto');
    }
};
