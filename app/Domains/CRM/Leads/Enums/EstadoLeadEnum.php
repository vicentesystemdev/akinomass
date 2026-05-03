<?php

namespace App\Domains\CRM\Leads\Enums;

enum EstadoLeadEnum: string
{
    case NUEVO = 'nuevo';
    case CONTACTADO = 'contactado';
    case INTERESADO = 'interesado';
    case PENDIENTE_PAGO = 'pendiente_pago';
    case CONVERTIDO = 'convertido';
    case PERDIDO = 'perdido';
    case DESCARTADO = 'descartado';
}
