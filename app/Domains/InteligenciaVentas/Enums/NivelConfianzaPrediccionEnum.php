<?php

namespace App\Domains\InteligenciaVentas\Enums;

enum NivelConfianzaPrediccionEnum: string
{
    case ALTA = 'alta';
    case MEDIA = 'media';
    case BAJA = 'baja';
}
