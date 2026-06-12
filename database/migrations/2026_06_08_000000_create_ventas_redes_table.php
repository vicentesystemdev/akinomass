<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas_redes', function (Blueprint $table): void {
            $table->id('cod_venta_red');
            $table->string('codigo_venta_red')->unique();
            $table->foreignId('cod_lead')->nullable()->constrained('leads', 'cod_lead')->nullOnDelete();
            $table->foreignId('cod_cliente')->nullable()->constrained('clientes', 'cod_cliente')->nullOnDelete();
            $table->foreignId('cod_canal_venta')->constrained('canales_venta', 'cod_canal_venta')->restrictOnDelete();
            $table->foreignId('cod_tipo_flujo_comercial')->nullable()->constrained('tipos_flujo_comercial', 'cod_tipo_flujo_comercial')->nullOnDelete();
            $table->foreignId('cod_usuario_responsable')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->string('estado_venta_red', 40)->default('borrador');
            $table->string('tipo_interaccion', 40)->nullable();
            $table->string('referencia_origen')->nullable();
            $table->text('observacion')->nullable();
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('descuento', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->foreignId('cod_checkout_sesion')->nullable()->constrained('checkout_sesiones', 'cod_checkout_sesion')->nullOnDelete();
            $table->foreignId('cod_pedido')->nullable()->constrained('pedidos', 'cod_pedido')->nullOnDelete();
            $table->timestamp('fecha_confirmacion')->nullable();
            $table->timestamps();

            $table->index(['estado_venta_red', 'cod_canal_venta']);
            $table->index(['cod_lead', 'cod_cliente']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas_redes');
    }
};
