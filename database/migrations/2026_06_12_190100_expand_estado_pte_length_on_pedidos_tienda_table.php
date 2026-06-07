<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos_tienda', function (Blueprint $table) {
            $table->string('estado_pte', 50)->default('pendiente_pago')->change();
        });
    }

    public function down(): void
    {
        Schema::table('pedidos_tienda', function (Blueprint $table) {
            $table->string('estado_pte', 20)->default('pendiente_pago')->change();
        });
    }
};
