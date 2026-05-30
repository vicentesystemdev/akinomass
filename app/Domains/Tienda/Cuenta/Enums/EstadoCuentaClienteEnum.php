<?php

namespace App\Domains\Tienda\Cuenta\Enums;

enum EstadoCuentaClienteEnum: string
{
    case ACTIVA = 'activa';
    case SUSPENDIDA = 'suspendida';
    case PENDIENTE_VERIFICACION = 'pendiente_verificacion';
}
