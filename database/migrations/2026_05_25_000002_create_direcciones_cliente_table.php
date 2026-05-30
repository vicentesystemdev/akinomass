<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('direcciones_cliente', function (Blueprint $table) {
            $table->bigIncrements('cod_direccion_cliente');
            $table->unsignedBigInteger('cod_cliente');
            $table->string('etiqueta_dir', 50);
            $table->string('nombre_destinatario_dir', 255);
            $table->string('telefono_dir', 30)->nullable();
            $table->text('direccion_dir');
            $table->string('ciudad_dir', 100)->nullable();
            $table->string('departamento_dir', 100)->nullable();
            $table->string('codigo_postal_dir', 20)->nullable();
            $table->text('referencia_dir')->nullable();
            $table->string('documento_nit_dir', 30)->nullable();
            $table->string('razon_social_dir', 255)->nullable();
            $table->boolean('es_predeterminada_dir')->default(false);
            $table->boolean('activo_dir')->default(true);
            $table->timestamps();

            $table->foreign('cod_cliente')
                ->references('cod_cliente')
                ->on('clientes');

            $table->index(['cod_cliente', 'activo_dir']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('direcciones_cliente');
    }
};
