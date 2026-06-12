<?php

namespace App\Domains\InteligenciaVentas\Enums;

enum TipoPeriodoAnalisisEnum: string
{
    case SEMANAL = 'semanal';
    case MENSUAL = 'mensual';
    case TRIMESTRAL = 'trimestral';
}
