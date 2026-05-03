<?php

namespace App\Domains\CRM\Clientes\Enums;

enum EstadoClienteEnum: string
{
    case ACTIVO = 'activo';
    case INACTIVO = 'inactivo';
    case RECURRENTE = 'recurrente';
    case BLOQUEADO = 'bloqueado';
}
