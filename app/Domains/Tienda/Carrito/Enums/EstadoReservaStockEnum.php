<?php

namespace App\Domains\Tienda\Carrito\Enums;

enum EstadoReservaStockEnum: string
{
    case ACTIVA = 'activa';
    case EXPIRADA = 'expirada';
    case LIBERADA = 'liberada';
    case CONVERTIDA_PEDIDO = 'convertida_pedido';
    case CANCELADA = 'cancelada';
}
