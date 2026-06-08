<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Services\ConversionVentaRedService;
use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Models\Pedido;
use App\Models\VentaRed;

class ConvertirVentaRedAPedidoAction
{
    public function __construct(
        private readonly ConversionVentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(VentaRed $ventaRed, ?int $codUsuario): Pedido
    {
        $pedido = $this->service->convertirAPedido($ventaRed, $codUsuario);
        $this->trazabilidad->registrarAccion($ventaRed->refresh(), 'convertir_pedido', "Se genero el pedido {$pedido->numero_pedido_ped} desde Ventas por Redes.");

        return $pedido;
    }
}
