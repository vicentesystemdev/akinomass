<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detalles_carrito', function (Blueprint $table): void {
            $table->unsignedBigInteger('cod_variante_producto')->nullable()->after('cod_producto');
            $table->foreign('cod_variante_producto')->references('cod_variante_producto')->on('variantes_producto')->restrictOnDelete()->cascadeOnUpdate();
        });
        DB::statement('ALTER TABLE detalles_carrito DROP CONSTRAINT IF EXISTS detalles_carrito_cod_carrito_cod_producto_unique');
        DB::statement('CREATE UNIQUE INDEX detalles_carrito_base_unique ON detalles_carrito (cod_carrito, cod_producto) WHERE cod_variante_producto IS NULL');
        DB::statement('CREATE UNIQUE INDEX detalles_carrito_variante_unique ON detalles_carrito (cod_carrito, cod_variante_producto) WHERE cod_variante_producto IS NOT NULL');

        foreach (['reservas_stock_carrito', 'detalles_pedido'] as $tabla) {
            Schema::table($tabla, function (Blueprint $table): void {
                $table->unsignedBigInteger('cod_variante_producto')->nullable()->after('cod_producto');
                $table->foreign('cod_variante_producto')->references('cod_variante_producto')->on('variantes_producto')->restrictOnDelete()->cascadeOnUpdate();
                $table->index('cod_variante_producto');
            });
        }
    }

    public function down(): void
    {
        foreach (['detalles_pedido', 'reservas_stock_carrito'] as $tabla) {
            Schema::table($tabla, function (Blueprint $table): void {
                $table->dropForeign(['cod_variante_producto']);
                $table->dropIndex(['cod_variante_producto']);
                $table->dropColumn('cod_variante_producto');
            });
        }
        DB::statement('DROP INDEX IF EXISTS detalles_carrito_variante_unique');
        DB::statement('DROP INDEX IF EXISTS detalles_carrito_base_unique');
        Schema::table('detalles_carrito', function (Blueprint $table): void {
            $table->dropForeign(['cod_variante_producto']);
            $table->dropColumn('cod_variante_producto');
            $table->unique(['cod_carrito', 'cod_producto']);
        });
    }
};
