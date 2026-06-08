<?php

namespace App\Domains\Tienda\PedidosWeb\Enums;

enum EstadoPedidoTiendaEnum: string
{
    case PENDIENTE_REVISION = 'pendiente_revision';
    case ACEPTADO = 'aceptado';
    case RECHAZADO = 'rechazado';
    case PENDIENTE_VALIDACION_PAGO = 'pendiente_validacion_pago';
    case PENDIENTE_PAGO = 'pendiente_pago';
    case PAGO_OBSERVADO = 'pago_observado';
    case PAGO_RECHAZADO = 'pago_rechazado';
    case PAGADO = 'pagado';
    case CONFIRMADO = 'confirmado';
    case FACTURADO = 'facturado';
    case CANCELADO = 'cancelado';
    case EXPIRADO = 'expirado';
}
