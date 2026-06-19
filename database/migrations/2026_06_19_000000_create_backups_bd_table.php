<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('backups_bd', function (Blueprint $table) {
            $table->bigIncrements('bck_id');

            $table->foreignId('usu_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('bck_tipo', 30);
            $table->string('bck_archivo', 255);
            $table->string('bck_ruta', 500);
            $table->timestamp('bck_fecha')->useCurrent();

            $table->string('bck_estado', 20)->default('en_proceso');

            $table->timestamp('bck_desde')->nullable();
            $table->timestamp('bck_hasta')->nullable();

            $table->text('bck_error')->nullable();

            $table->timestamps();

            $table->index('usu_id');
            $table->index('bck_tipo');
            $table->index('bck_estado');
            $table->index('bck_fecha');
            $table->index(['bck_tipo', 'bck_estado']);
            $table->index(['bck_desde', 'bck_hasta']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backups_bd');
    }
};
