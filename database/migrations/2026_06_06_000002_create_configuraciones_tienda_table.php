<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuraciones_tienda', function (Blueprint $table) {
            $table->bigIncrements('cod_configuracion_tienda');

            $table->string('clave_cti', 100)->unique();
            $table->text('valor_cti');
            $table->string('tipo_cti', 30)->default('string');
            $table->text('descripcion_cti')->nullable();
            $table->boolean('activo_cti')->default(true);

            $table->foreignId('actualizado_por_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuraciones_tienda');
    }
};
