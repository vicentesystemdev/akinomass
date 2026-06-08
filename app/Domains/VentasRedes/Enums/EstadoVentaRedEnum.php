<?php

namespace App\Domains\VentasRedes\Enums;

enum EstadoVentaRedEnum: string
{
    case BORRADOR = 'borrador';
    case PENDIENTE_CONFIRMACION = 'pendiente_confirmacion';
    case CONFIRMADA = 'confirmada';
    case CONVERTIDA_CHECKOUT = 'convertida_checkout';
    case CONVERTIDA_PEDIDO = 'convertida_pedido';
    case CANCELADA = 'cancelada';
}
