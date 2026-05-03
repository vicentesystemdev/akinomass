<?php

namespace App\Domains\Comercial\Pedidos\Enums;

enum EstadoPedidoEnum: string
{
    case BORRADOR = 'borrador';
    case CONFIRMADO = 'confirmado';
    case PREPARANDO = 'preparando';
    case ENVIADO = 'enviado';
    case ENTREGADO = 'entregado';
    case CANCELADO = 'cancelado';
    case DEVUELTO = 'devuelto';
}
