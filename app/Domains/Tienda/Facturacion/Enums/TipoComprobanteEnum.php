<?php

namespace App\Domains\Tienda\Facturacion\Enums;

enum TipoComprobanteEnum: string
{
    case FACTURA = 'factura';
    case RECIBO = 'recibo';
    case NOTA_CREDITO = 'nota_credito';
}
