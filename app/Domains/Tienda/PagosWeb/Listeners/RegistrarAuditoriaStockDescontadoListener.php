<?php

namespace App\Domains\Tienda\PagosWeb\Listeners;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Tienda\PagosWeb\Events\StockPedidoWebDescontadoEvent;

class RegistrarAuditoriaStockDescontadoListener
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function handle(StockPedidoWebDescontadoEvent $event): void
    {
        $pedidoTienda = $event->pedidoTienda;

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarInsercion(
            $contexto, 'Tienda', 'inventarios',
            (string) $pedidoTienda->cod_pedido_tienda,
            submodulo: 'Stock descontado',
            descripcion: "Stock físico descontado para pedido tienda #{$pedidoTienda->cod_pedido_tienda} (pedido #{$pedidoTienda->cod_pedido}).",
        );
    }
}
