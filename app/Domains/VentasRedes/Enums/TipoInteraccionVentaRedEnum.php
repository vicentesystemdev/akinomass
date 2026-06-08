<?php

namespace App\Domains\VentasRedes\Enums;

enum TipoInteraccionVentaRedEnum: string
{
    case MENSAJE_PRIVADO = 'mensaje_privado';
    case COMENTARIO = 'comentario';
    case PUBLICACION = 'publicacion';
    case HISTORIA = 'historia';
    case WHATSAPP = 'whatsapp';
    case MARKETPLACE = 'marketplace';
    case PRESENCIAL = 'presencial';
    case OTRO = 'otro';
}
