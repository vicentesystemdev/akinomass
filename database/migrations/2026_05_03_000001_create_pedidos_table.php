<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id('cod_pedido');
            $table->foreignId('cod_cliente')->constrained('clientes', 'cod_cliente');
            $table->foreignId('cod_canal_venta')->constrained('canales_venta', 'cod_canal_venta');
            $table->foreignId('cod_tipo_flujo_comercial')->constrained('tipos_flujo_comercial', 'cod_tipo_flujo_comercial');
            $table->foreignId('cod_usuario_responsable')->nullable()->constrained('users');
            $table->string('numero_pedido_ped', 30)->unique();
            $table->date('fecha_pedido_ped');
            $table->string('estado_ped', 20)->index();
            $table->decimal('subtotal_ped', 12, 2)->default(0);
            $table->decimal('descuento_ped', 12, 2)->default(0);
            $table->decimal('total_ped', 12, 2)->default(0);
            $table->text('observacion_ped')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
