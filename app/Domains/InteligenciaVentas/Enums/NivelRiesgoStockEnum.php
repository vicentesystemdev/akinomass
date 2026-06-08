<?php

namespace App\Domains\InteligenciaVentas\Enums;

enum NivelRiesgoStockEnum: string
{
    case ALTO = 'alto';
    case MEDIO = 'medio';
    case BAJO = 'bajo';
    case SIN_RIESGO = 'sin_riesgo';
}
