<?php

namespace App\Domains\Tienda\PagosWeb\Actions;

use App\Models\PagoTienda;

class ObtenerPagoClienteAction
{
    public function execute(int $userId, int $codPedido): ?PagoTienda
    {
        return PagoTienda::with(['pago', 'checkoutSesion'])
            ->where('user_id', $userId)
            ->whereHas('checkoutSesion', function ($q) use ($codPedido) {
                $q->whereHas('pedidoTienda', function ($q2) use ($codPedido) {
                    $q2->where('cod_pedido', $codPedido);
                });
            })
            ->first();
    }
}
