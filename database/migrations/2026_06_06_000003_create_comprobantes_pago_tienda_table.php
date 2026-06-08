<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comprobantes_pago_tienda', function (Blueprint $table) {
            $table->bigIncrements('cod_comprobante_pago_tienda');

            $table->unsignedBigInteger('cod_pago_tienda');

            $table->string('ruta_comprobante_cpt', 255);
            $table->string('hash_comprobante_cpt', 64)->nullable();
            $table->string('mime_cpt', 100)->nullable();
            $table->unsignedBigInteger('tamano_bytes_cpt')->nullable();

            $table->string('estado_cpt', 30)->default('pendiente')->index();
            $table->text('observacion_admin_cpt')->nullable();

            $table->foreignId('subido_por_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('revisado_por_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamp('subido_en_cpt');
            $table->timestamp('revisado_en_cpt')->nullable();

            $table->timestamps();

            $table->foreign('cod_pago_tienda')->references('cod_pago_tienda')->on('pagos_tienda')->cascadeOnDelete();

            $table->index(['cod_pago_tienda', 'estado_cpt']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comprobantes_pago_tienda');
    }
};
