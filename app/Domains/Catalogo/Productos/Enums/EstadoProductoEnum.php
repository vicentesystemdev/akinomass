<?php

namespace App\Domains\Catalogo\Productos\Enums;

enum EstadoProductoEnum: string
{
    case ACTIVO = 'activo';
    case INACTIVO = 'inactivo';
    case AGOTADO = 'agotado';
    case DESCONTINUADO = 'descontinuado';
}
