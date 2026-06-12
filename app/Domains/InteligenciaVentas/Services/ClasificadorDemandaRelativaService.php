<?php

namespace App\Domains\InteligenciaVentas\Services;

use App\Domains\InteligenciaVentas\Enums\EstadoDemandaEnum;
use App\Models\ConfiguracionInteligenciaVentas;

class ClasificadorDemandaRelativaService
{
    public function clasificar(float $indice, ConfiguracionInteligenciaVentas $configuracion): EstadoDemandaEnum
    {
        $umbralBaja = (float) ($configuracion->umbral_indice_demanda_baja ?? 0.70);
        $umbralAlta = (float) ($configuracion->umbral_indice_demanda_alta ?? 1.20);

        if ($indice < $umbralBaja) {
            return EstadoDemandaEnum::BAJA;
        }

        if ($indice > $umbralAlta) {
            return EstadoDemandaEnum::ALTA;
        }

        return EstadoDemandaEnum::MEDIA;
    }
}
