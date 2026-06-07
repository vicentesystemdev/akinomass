<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventarios', function (Blueprint $table): void {
            $table->unsignedBigInteger('cod_variante_producto')->nullable()->after('cod_producto');
            $table->foreign('cod_variante_producto')
                ->references('cod_variante_producto')
                ->on('variantes_producto')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->index('cod_variante_producto');
        });
    }

    public function down(): void
    {
        Schema::table('inventarios', function (Blueprint $table): void {
            $table->dropForeign(['cod_variante_producto']);
            $table->dropIndex(['cod_variante_producto']);
            $table->dropColumn('cod_variante_producto');
        });
    }
};
