<?php
namespace App\Domains\Comercial\LiveSales\Enums;
enum EstadoInteraccionLiveEnum:string { case NUEVO='nuevo'; case CONTACTADO='contactado'; case CONVERTIDO_LEAD='convertido_lead'; case CONVERTIDO_PEDIDO='convertido_pedido'; case DESCARTADO='descartado'; }
