<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('interacciones_live', function (Blueprint $table): void {
            $table->id('cod_interaccion_live');
            $table->foreignId('cod_sesion_live')->constrained('sesiones_live', 'cod_sesion_live')->cascadeOnDelete();
            $table->foreignId('cod_producto')->nullable()->constrained('productos', 'cod_producto')->nullOnDelete();
            $table->string('alias_int')->nullable();
            $table->string('nombre_int')->nullable();
            $table->string('telefono_int', 50)->nullable();
            $table->text('observacion_int')->nullable();
            $table->string('intencion_compra_int', 100)->nullable();
            $table->string('estado_int', 40);
            $table->foreignId('cod_lead')->nullable()->constrained('leads', 'cod_lead')->nullOnDelete();
            $table->foreignId('cod_pedido')->nullable()->constrained('pedidos', 'cod_pedido')->nullOnDelete();
            $table->foreignId('cod_usuario_responsable')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interacciones_live');
    }
};
