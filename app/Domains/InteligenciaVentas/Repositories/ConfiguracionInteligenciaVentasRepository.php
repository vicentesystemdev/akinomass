<?php

namespace App\Domains\InteligenciaVentas\Repositories;

use App\Models\ConfiguracionInteligenciaVentas;

class ConfiguracionInteligenciaVentasRepository
{
    public function activa(): ConfiguracionInteligenciaVentas
    {
        return ConfiguracionInteligenciaVentas::firstOrCreate(
            ['activo' => true],
            ['dias_analisis' => 90, 'periodo_agrupacion' => 'mensual'],
        );
    }

    public function actualizar(array $data): ConfiguracionInteligenciaVentas
    {
        $configuracion = $this->activa();
        $configuracion->update($data);

        return $configuracion->refresh();
    }
}
