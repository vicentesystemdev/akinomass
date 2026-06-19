<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('backups_bd', function (Blueprint $table) {
            $table->string('bck_tipo', 30)->nullable()->change();
            $table->string('bck_archivo', 255)->nullable()->change();
            $table->string('bck_ruta', 500)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('backups_bd', function (Blueprint $table) {
            $table->string('bck_tipo', 30)->nullable(false)->change();
            $table->string('bck_archivo', 255)->nullable(false)->change();
            $table->string('bck_ruta', 500)->nullable(false)->change();
        });
    }
};
