<?php

namespace App\Domains\Comercial\Pagos\Enums;

enum EstadoPagoEnum: string
{
    case PENDIENTE = 'pendiente';
    case PAGADO = 'pagado';
    case OBSERVADO = 'observado';
    case RECHAZADO = 'rechazado';
    case REEMBOLSADO = 'reembolsado';
}
