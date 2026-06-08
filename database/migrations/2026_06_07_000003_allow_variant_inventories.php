<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE inventarios DROP CONSTRAINT IF EXISTS inventarios_cod_producto_unique');
        DB::statement('CREATE UNIQUE INDEX inventarios_producto_base_unique ON inventarios (cod_producto) WHERE cod_variante_producto IS NULL');
        DB::statement('CREATE UNIQUE INDEX inventarios_variante_unique ON inventarios (cod_variante_producto) WHERE cod_variante_producto IS NOT NULL');
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS inventarios_variante_unique');
        DB::statement('DROP INDEX IF EXISTS inventarios_producto_base_unique');
        DB::statement('ALTER TABLE inventarios ADD CONSTRAINT inventarios_cod_producto_unique UNIQUE (cod_producto)');
    }
};
