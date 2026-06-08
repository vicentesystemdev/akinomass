<?php

namespace App\Domains\VentasRedes\Actions;

use App\Domains\VentasRedes\Services\ConversionVentaRedService;
use App\Domains\VentasRedes\Services\TrazabilidadVentaRedService;
use App\Models\Cliente;
use App\Models\VentaRed;

class ConvertirLeadVentaRedAClienteAction
{
    public function __construct(
        private readonly ConversionVentaRedService $service,
        private readonly TrazabilidadVentaRedService $trazabilidad,
    ) {}

    public function execute(VentaRed $ventaRed): Cliente
    {
        $cliente = $this->service->convertirLeadACliente($ventaRed);
        $this->trazabilidad->registrarAccion($ventaRed->refresh(), 'convertir_lead_cliente', 'Se convirtio el lead asociado en cliente.');

        return $cliente;
    }
}
