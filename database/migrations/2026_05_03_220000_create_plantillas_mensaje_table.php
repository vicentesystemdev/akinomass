<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('plantillas_mensaje', function (Blueprint $table) {
            $table->bigIncrements('cod_plantilla_mensaje');
            $table->string('nombre_pla');
            $table->string('tipo_pla');
            $table->text('contenido_pla');
            $table->boolean('activo_pla')->default(true);
            $table->timestamps();

            $table->index('tipo_pla');
            $table->index('activo_pla');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plantillas_mensaje');
    }
};
