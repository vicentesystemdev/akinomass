<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id('cod_pago');
            $table->foreignId('cod_pedido')->constrained('pedidos', 'cod_pedido')->cascadeOnDelete();
            $table->foreignId('cod_usuario_responsable')->nullable()->constrained('users');
            $table->string('metodo_pago_pag', 30)->index();
            $table->string('estado_pago_pag', 30)->index();
            $table->decimal('monto_pag', 12, 2);
            $table->string('referencia_pag', 150)->nullable();
            $table->date('fecha_pago_pag');
            $table->text('observacion_pag')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
