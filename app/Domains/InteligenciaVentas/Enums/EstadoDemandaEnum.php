<?php

namespace App\Domains\InteligenciaVentas\Enums;

enum EstadoDemandaEnum: string
{
    case BAJA = 'baja';
    case MEDIA = 'media';
    case ALTA = 'alta';
}
