<?php

declare(strict_types=1);

namespace Tests\Unit\InteligenciaVentas;

use App\Domains\InteligenciaVentas\Services\TendenciaVentasRegresionLinealService;
use PHPUnit\Framework\TestCase;

final class TendenciaVentasRegresionLinealServiceTest extends TestCase
{
    public function test_calcula_pendiente_e_intercepto(): void
    {
        $resultado = $this->service()->analizar($this->serie([2, 4, 6, 8]));

        $this->assertEqualsWithDelta(2.0, $resultado['pendiente'], 0.0001);
        $this->assertEqualsWithDelta(2.0, $resultado['intercepto'], 0.0001);
        $this->assertEqualsWithDelta(10.0, $resultado['prediccion_siguiente_periodo'], 0.0001);
        $this->assertEqualsWithDelta(1.0, $resultado['r_cuadrado'], 0.0001);
    }

    public function test_datos_ascendentes_devuelven_tendencia_creciente(): void
    {
        $resultado = $this->service()->analizar($this->serie([10, 15, 22, 30, 40, 52]));

        $this->assertSame('Creciente', $resultado['direccion_tendencia']);
        $this->assertSame('Aumentar compra', $resultado['recomendacion']);
    }

    public function test_datos_descendentes_devuelven_tendencia_decreciente(): void
    {
        $resultado = $this->service()->analizar($this->serie([60, 50, 40, 30, 20, 10]));

        $this->assertSame('Decreciente', $resultado['direccion_tendencia']);
        $this->assertSame('Reducir compra', $resultado['recomendacion']);
    }

    public function test_pocos_datos_devuelven_mensaje_de_insuficiencia(): void
    {
        $resultado = $this->service()->analizar($this->serie([10, 20]));

        $this->assertFalse($resultado['suficientes_datos']);
        $this->assertSame(
            'No existen datos históricos suficientes para calcular una tendencia confiable.',
            $resultado['mensaje'],
        );
    }

    private function service(): TendenciaVentasRegresionLinealService
    {
        return new TendenciaVentasRegresionLinealService();
    }

    private function serie(array $valores): array
    {
        return collect($valores)->map(fn (int|float $valor, int $indice): array => [
            'periodo' => "P{$indice}",
            'etiqueta' => "Periodo {$indice}",
            'valor' => $valor,
        ])->all();
    }
}
