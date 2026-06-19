<?php

namespace Database\Seeders\Demo;

use App\Models\ConfiguracionInteligenciaVentas;
use App\Domains\InteligenciaVentas\Actions\GenerarPrediccionVentasAction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class DemoDefensaInteligenciaVentasEscenariosSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear configuración activa de Inteligencia de Ventas
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

        $this->command->info('Configuración de Inteligencia de Ventas (Defensa) inicializada.');

        // 2. Ejecutar cálculo de regresión lineal y proyecciones
        $this->command->info('Calculando predicciones de ventas y recomendaciones de abastecimiento...');
        try {
            $action = app(GenerarPrediccionVentasAction::class);
            // Ejecutar con un periodo de fin controlado en la fecha máxima del dataset
            $action->execute([
                'dias_analisis' => 90,
                'periodo_fin' => '2026-06-19',
                'periodo_inicio' => '2026-03-21',
            ]);
            $this->command->info('Proyecciones de Inteligencia de Ventas autogeneradas con éxito.');
        } catch (\Throwable $e) {
            $this->command->warn('No se pudieron calcular automáticamente las predicciones: ' . $e->getMessage());
            Log::error('Error en seeder de predicciones: ' . $e->getMessage(), ['exception' => $e]);
        }
    }
}
