<?php

namespace App\Domains\InteligenciaVentas\Enums;

enum NivelRecomendacionAbastecimientoEnum: string
{
    case ALTA = 'alta';
    case MEDIA = 'media';
    case BAJA = 'baja';
    case NO_ABASTECER = 'no_abastecer';
}
