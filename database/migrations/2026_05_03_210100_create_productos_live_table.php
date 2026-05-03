<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('productos_live', function (Blueprint $table): void {
            $table->id('cod_producto_live');
            $table->foreignId('cod_sesion_live')->constrained('sesiones_live', 'cod_sesion_live')->cascadeOnDelete();
            $table->foreignId('cod_producto')->constrained('productos', 'cod_producto');
            $table->unsignedInteger('orden_proliv')->default(1);
            $table->decimal('precio_live_proliv', 12, 2)->nullable();
            $table->text('observacion_proliv')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos_live');
    }
};
