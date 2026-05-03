<?php

namespace App\Domains\Comercial\Canales\Enums;

enum CodigoTipoFlujoComercialEnum: string
{
    case VENTA_EN_VIVO = 'venta_en_vivo';
    case CONVERSACION_DIRECTA = 'conversacion_directa';
    case MARKETPLACE = 'marketplace';
    case CAMPANIA_MARKETING = 'campania_marketing';
    case REFERIDO = 'referido';
    case VENTA_DIRECTA = 'venta_directa';
    case OTRO = 'otro';
}
