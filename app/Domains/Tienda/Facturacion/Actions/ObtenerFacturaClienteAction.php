<?php

namespace App\Domains\Tienda\Facturacion\Actions;

use App\Models\Factura;
use App\Models\PedidoTienda;

class ObtenerFacturaClienteAction
{
    public function execute(int $userId, int $codPedido): ?Factura
    {
        $pedidoTienda = PedidoTienda::where('user_id', $userId)
            ->where('cod_pedido', $codPedido)
            ->first();

        if (!$pedidoTienda) {
            return null;
        }

        return Factura::with(['detalles', 'pago'])
            ->where('cod_pedido', $codPedido)
            ->first();
    }
}
