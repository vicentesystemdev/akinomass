<?php

namespace App\Domains\Tienda\PedidosWeb\Enums;

enum EstadoPedidoTiendaEnum: string
{
    case PENDIENTE_PAGO = 'pendiente_pago';
    case PAGADO = 'pagado';
    case FACTURADO = 'facturado';
    case CANCELADO = 'cancelado';
}
