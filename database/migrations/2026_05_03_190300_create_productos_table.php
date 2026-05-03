<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table): void {
            $table->id('cod_producto');
            $table->foreignId('cod_categoria_producto')
                ->constrained('categorias_producto', 'cod_categoria_producto')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('nombre_pro', 255);
            $table->text('descripcion_pro')->nullable();
            $table->decimal('precio_venta_pro', 12, 2);
            $table->decimal('precio_costo_pro', 12, 2)->nullable();
            $table->string('sku_pro', 100)->nullable()->unique();
            $table->string('imagen_pro', 255)->nullable();
            $table->string('estado_pro', 30);
            $table->timestamps();

            $table->index('estado_pro');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
