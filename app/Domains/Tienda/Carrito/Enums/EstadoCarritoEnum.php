<?php

namespace App\Domains\Tienda\Carrito\Enums;

enum EstadoCarritoEnum: string
{
    case ACTIVO = 'activo';
    case EN_CHECKOUT = 'en_checkout';
    case CONVERTIDO = 'convertido';
    case ABANDONADO = 'abandonado';
    case EXPIRADO = 'expirado';
}
