<?php

namespace App\Domains\CRM\Plantillas\Enums;

enum TipoPlantillaMensajeEnum: string
{
    case PRIMER_CONTACTO = 'primer_contacto';
    case SEGUIMIENTO = 'seguimiento';
    case CONFIRMACION_INTERES = 'confirmacion_interes';
    case CONFIRMACION_PEDIDO = 'confirmacion_pedido';
    case RECORDATORIO_PAGO = 'recordatorio_pago';
    case AGRADECIMIENTO = 'agradecimiento';
    case CLIENTE_INACTIVO = 'cliente_inactivo';
    case STOCK_DISPONIBLE = 'stock_disponible';
    case RESPUESTA_RAPIDA_LIVE = 'respuesta_rapida_live';
}
