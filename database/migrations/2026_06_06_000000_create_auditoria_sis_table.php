<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("CREATE TYPE tipo_accion_auditoria AS ENUM (
            'insert', 'update', 'delete',
            'login', 'logout',
            'cancelacion', 'anulacion', 'cambio_estado'
        )");

        Schema::create('auditoria_sis', function (Blueprint $table) {
            $table->bigIncrements('cod_auditoria');

            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('cod_cliente')->nullable();
            $table->foreign('cod_cliente')->references('cod_cliente')->on('clientes')->nullOnDelete();

            $table->timestamp('fecha_aud')->useCurrent();

            $table->string('modulo_aud', 100);
            $table->string('submodulo_aud', 100)->nullable();
            $table->string('tabla_aud', 200);
            $table->string('id_registro_aud', 200);

            $table->string('accion_aud', 30);
            $table->string('accion_funcional_aud', 150)->nullable();
            $table->text('descripcion_aud')->nullable();

            $table->string('campo_aud', 200)->nullable();
            $table->text('valor_anterior_aud')->nullable();
            $table->text('valor_nuevo_aud')->nullable();

            $table->string('metodo_http_aud', 10)->nullable();
            $table->string('ip_aud', 100)->nullable();
            $table->text('user_agent_aud')->nullable();
            $table->string('dispositivo_aud', 200)->nullable();
            $table->string('navegador_aud', 100)->nullable();
            $table->string('sistema_operativo_aud', 100)->nullable();
            $table->uuid('id_evento_aud')->nullable();

            $table->timestamps();

            $table->index('fecha_aud');
            $table->index('user_id');
            $table->index('cod_cliente');
            $table->index('accion_aud');
            $table->index('modulo_aud');
            $table->index('tabla_aud');
            $table->index('id_registro_aud');
            $table->index('id_evento_aud');
            $table->index(['tabla_aud', 'id_registro_aud']);
            $table->index(['modulo_aud', 'fecha_aud']);
            $table->index(['user_id', 'fecha_aud']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditoria_sis');
        DB::statement('DROP TYPE IF EXISTS tipo_accion_auditoria');
    }
};
