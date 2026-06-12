<?php

namespace App\Domains\Tienda\PedidosWeb\Actions;

use App\Models\PedidoTienda;
use Illuminate\Support\Collection;

class ListarPedidosClienteAction
{
    public function execute(int $userId): Collection
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
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
