<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sesiones_live', function (Blueprint $table): void {
            $table->id('cod_sesion_live');
            $table->string('titulo_ses');
            $table->timestamp('fecha_inicio_ses');
            $table->timestamp('fecha_fin_ses')->nullable();
            $table->string('estado_ses', 30);
            $table->text('resumen_ses')->nullable();
            $table->foreignId('cod_canal_venta')->constrained('canales_venta', 'cod_canal_venta');
            $table->foreignId('cod_usuario_responsable')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sesiones_live');
    }
};
