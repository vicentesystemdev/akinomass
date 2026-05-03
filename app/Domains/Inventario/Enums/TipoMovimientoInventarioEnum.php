<?php

namespace App\Domains\Inventario\Enums;

enum TipoMovimientoInventarioEnum: string
{
    case ENTRADA = 'entrada';
    case SALIDA = 'salida';
    case AJUSTE = 'ajuste';
    case DEVOLUCION = 'devolucion';
    case RESERVA = 'reserva';
    case CANCELACION = 'cancelacion';
}
