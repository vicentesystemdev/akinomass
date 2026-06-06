<?php

namespace App\Domains\Auditoria\Enums;

enum TipoAccionAuditoriaEnum: string
{
    case INSERT = 'insert';
    case UPDATE = 'update';
    case DELETE = 'delete';
    case LOGIN = 'login';
    case LOGOUT = 'logout';
    case CANCELACION = 'cancelacion';
    case ANULACION = 'anulacion';
    case CAMBIO_ESTADO = 'cambio_estado';
}
