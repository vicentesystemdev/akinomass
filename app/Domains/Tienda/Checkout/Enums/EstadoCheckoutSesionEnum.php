<?php

namespace App\Domains\Tienda\Checkout\Enums;

enum EstadoCheckoutSesionEnum: string
{
    case INICIADO = 'iniciado';
    case DATOS_COMPLETADOS = 'datos_completados';
    case PEDIDO_GENERADO = 'pedido_generado';
    case PAGO_REGISTRADO = 'pago_registrado';
    case PAGO_CONFIRMADO = 'pago_confirmado';
    case COMPLETADO = 'completado';
    case EXPIRADO = 'expirado';
    case CANCELADO = 'cancelado';
}
