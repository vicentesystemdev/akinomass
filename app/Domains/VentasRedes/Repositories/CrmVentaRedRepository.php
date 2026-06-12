<?php

namespace App\Domains\VentasRedes\Repositories;

use App\Models\Cliente;
use App\Models\Lead;

class CrmVentaRedRepository
{
    public function leads()
    {
        return Lead::with(['canalVenta', 'tipoFlujoComercial'])
            ->latest('cod_lead')
            ->limit(200)
            ->get();
    }

    public function clientes()
    {
        return Cliente::with(['canalVenta', 'tipoFlujoComercial'])
            ->orderBy('nombre_cli')
            ->limit(200)
            ->get();
    }
}
