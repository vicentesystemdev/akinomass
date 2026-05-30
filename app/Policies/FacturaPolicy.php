<?php

namespace App\Policies;

use App\Models\Factura;
use App\Models\PedidoTienda;
use App\Models\User;

class FacturaPolicy
{
    public function view(User $user, Factura $factura): bool
    {
        $pedidoTienda = PedidoTienda::where('cod_pedido', $factura->cod_pedido)
            ->where('user_id', $user->id)
            ->first();

        return $pedidoTienda !== null;
    }
}
