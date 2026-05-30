<?php

namespace App\Domains\Tienda\Facturacion\Enums;

enum EstadoFacturaEnum: string
{
    case BORRADOR = 'borrador';
    case EMITIDA = 'emitida';
    case ANULADA = 'anulada';
}
