<?php

namespace Database\Seeders;

use App\Models\ConfiguracionInteligenciaVentas;
use App\Domains\InteligenciaVentas\Actions\GenerarPrediccionVentasAction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class InteligenciaVentasDemoSeeder extends Seeder
{
    public function run(): void
    {
        // Asegurar la existencia de la configuración de inteligencia de ventas
        ConfiguracionInteligenciaVentas::updateOrCreate(
            ['activo' => true],
            [
                'dias_analisis' => 90,
                'periodo_agrupacion' => 'mensual',
                'umbral_indice_demanda_baja' => 0.70,
                'umbral_indice_demanda_alta' => 1.20,
                'porcentaje_stock_seguridad' => 20.00,
                'stock_seguridad_minimo' => 1,
                'limite_factor_tendencia_min' => 0.70,
                'limite_factor_tendencia_max' => 1.40,
                'peso_transicion_demanda' => 0.40,
                'peso_tendencia' => 0.25,
                'peso_rotacion' => 0.20,
                'peso_canal' => 0.15,
            ]
        );

        $this->command->info('Configuración de Inteligencia de Ventas inicializada.');

        // Intentar calcular y generar las predicciones reales sobre la base de pedidos sembrada
        try {
            $action = app(GenerarPrediccionVentasAction::class);
            $action->execute();
            $this->command->info('Predicciones de ventas calculadas dinámicamente y registradas con éxito.');
        } catch (\Throwable $e) {
            $this->command->warn('No se pudieron autogenerar las predicciones desde el Seeder.');
            $this->command->warn('Error: ' . $e->getMessage());
            $this->command->info('Puedes ejecutarlas manualmente en Tinker usando:');
            $this->command->info('>>> app(App\Domains\InteligenciaVentas\Actions\GenerarPrediccionVentasAction::class)->execute();');
            Log::error('Error generando predicciones en seeder: ' . $e->getMessage(), ['exception' => $e]);
        }
    }
}
