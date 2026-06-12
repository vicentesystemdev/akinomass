<?php

namespace App\Domains\Tienda\PedidosWeb\Actions;

use App\Models\PedidoTienda;

class ObtenerPedidoClienteAction
{
    public function execute(int $userId, int $codPedido): ?PedidoTienda
    {
        return PedidoTienda::with([
            'pedido.cliente',
            'pedido.detalles.producto',
            'pedido.detalles.variante.talla',
            'checkoutSesion',
            'pagoTienda.pago',
            'pagoTienda.comprobantes',
            'pago',
            'factura',
        ])
            ->where('user_id', $userId)
            ->where('cod_pedido', $codPedido)
            ->first();
    }
}
