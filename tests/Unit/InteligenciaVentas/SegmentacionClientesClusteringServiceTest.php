<?php

declare(strict_types=1);

namespace Tests\Unit\InteligenciaVentas;

use App\Domains\InteligenciaVentas\Services\SegmentacionClientesClusteringService;
use PHPUnit\Framework\TestCase;

final class SegmentacionClientesClusteringServiceTest extends TestCase
{
    public function test_genera_tres_clusters_con_datos_controlados(): void
    {
        $resultado = (new SegmentacionClientesClusteringService())->segmentar([
            $this->cliente(1, 12, 4800, 400, 5, 4.0, 10, 100),
            $this->cliente(2, 10, 3900, 390, 8, 3.3, 8, 100),
            $this->cliente(3, 5, 1200, 240, 45, 1.3, 5, 100),
            $this->cliente(4, 4, 900, 225, 60, 1.0, 4, 80),
            $this->cliente(5, 1, 120, 120, 180, 0.2, 1, 100),
            $this->cliente(6, 1, 80, 80, 250, 0.1, 1, 50),
        ], 3);

        $this->assertTrue($resultado['suficientes_datos']);
        $this->assertCount(3, $resultado['resumen_clusters']);
        $this->assertSame([1, 2, 3], collect($resultado['clientes'])->pluck('cluster')->unique()->sort()->values()->all());
        $this->assertSame('Cliente frecuente / alto valor', $resultado['resumen_clusters'][0]['etiqueta']);
    }

    public function test_devuelve_mensaje_cuando_no_hay_datos_suficientes(): void
    {
        $resultado = (new SegmentacionClientesClusteringService())->segmentar([
            $this->cliente(1, 0, 0, 0, 365, 0, 0, 0),
            $this->cliente(2, 1, 100, 100, 20, 1, 1, 100),
        ], 3);

        $this->assertFalse($resultado['suficientes_datos']);
        $this->assertSame(
            'No existen datos históricos suficientes para generar una segmentación confiable.',
            $resultado['mensaje'],
        );
    }

    private function cliente(
        int $id,
        int $pedidos,
        float $total,
        float $ticket,
        int $recencia,
        float $frecuencia,
        int $productos,
        float $pagados,
    ): array {
        return [
            'cliente_id' => $id,
            'nombre_cliente' => "Cliente {$id}",
            'cantidad_pedidos_confirmados' => $pedidos,
            'cantidad_pedidos_pagados' => max(1, $pedidos),
            'monto_total_comprado' => $total,
            'ticket_promedio' => $ticket,
            'ultima_compra' => now()->subDays($recencia)->toDateString(),
            'dias_desde_ultima_compra' => $recencia,
            'frecuencia_compra' => $frecuencia,
            'cantidad_productos_distintos' => $productos,
            'porcentaje_pedidos_pagados' => $pagados,
        ];
    }
}
