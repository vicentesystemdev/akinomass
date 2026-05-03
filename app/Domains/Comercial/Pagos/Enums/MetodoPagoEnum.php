<?php

namespace App\Domains\Comercial\Pagos\Enums;

enum MetodoPagoEnum: string
{
    case QR = 'qr';
    case TRANSFERENCIA = 'transferencia';
    case EFECTIVO = 'efectivo';
    case DEPOSITO = 'deposito';
    case OTRO = 'otro';
}
