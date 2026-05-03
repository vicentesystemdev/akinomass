<?php

namespace App\Domains\Comercial\Canales\Enums;

enum CodigoCanalVentaEnum: string
{
    case TIKTOK_LIVE = 'tiktok_live';
    case WHATSAPP = 'whatsapp';
    case INSTAGRAM = 'instagram';
    case FACEBOOK = 'facebook';
    case TELEGRAM = 'telegram';
    case MARKETPLACE = 'marketplace';
    case WEB = 'web';
    case VENTA_DIRECTA = 'venta_directa';
    case OTRO = 'otro';
}
