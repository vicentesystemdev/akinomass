<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE inventarios DROP CONSTRAINT IF EXISTS inventarios_cod_variante_producto_foreign');
        DB::statement('
            ALTER TABLE inventarios
            ADD CONSTRAINT inventarios_cod_variante_producto_foreign
            FOREIGN KEY (cod_variante_producto)
            REFERENCES variantes_producto (cod_variante_producto)
            ON UPDATE CASCADE
            ON DELETE RESTRICT
        ');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE inventarios DROP CONSTRAINT IF EXISTS inventarios_cod_variante_producto_foreign');
        DB::statement('
            ALTER TABLE inventarios
            ADD CONSTRAINT inventarios_cod_variante_producto_foreign
            FOREIGN KEY (cod_variante_producto)
            REFERENCES variantes_producto (cod_variante_producto)
            ON UPDATE CASCADE
            ON DELETE SET NULL
        ');
    }
};
