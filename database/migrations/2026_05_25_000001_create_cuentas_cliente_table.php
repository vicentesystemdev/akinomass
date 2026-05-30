<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cuentas_cliente', function (Blueprint $table) {
            $table->bigIncrements('cod_cuenta_cliente');
            $table->foreignId('user_id')->constrained('users')->unique();
            $table->unsignedBigInteger('cod_cliente');
            $table->string('estado_cue', 20)->default('activa')->index();
            $table->timestamp('fecha_activacion_cue')->nullable();
            $table->timestamps();

            $table->foreign('cod_cliente')
                ->references('cod_cliente')
                ->on('clientes')
                ->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cuentas_cliente');
    }
};
