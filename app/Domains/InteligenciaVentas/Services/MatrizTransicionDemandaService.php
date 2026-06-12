<?php

namespace App\Domains\InteligenciaVentas\Services;

use App\Domains\InteligenciaVentas\DTOs\MatrizTransicionDemandaData;
use App\Domains\InteligenciaVentas\Enums\EstadoDemandaEnum;
use App\Domains\InteligenciaVentas\Enums\NivelConfianzaPrediccionEnum;

class MatrizTransicionDemandaService
{
    public function calcular(array $estadosHistoricos, EstadoDemandaEnum $estadoActual): MatrizTransicionDemandaData
    {
        $estados = array_map(fn (EstadoDemandaEnum $estado) => $estado->value, EstadoDemandaEnum::cases());
        $conteos = array_fill_keys($estados, array_fill_keys($estados, 0));

        for ($i = 0; $i < count($estadosHistoricos) - 1; $i++) {
            $desde = $estadosHistoricos[$i] instanceof EstadoDemandaEnum ? $estadosHistoricos[$i]->value : (string) $estadosHistoricos[$i];
            $hacia = $estadosHistoricos[$i + 1] instanceof EstadoDemandaEnum ? $estadosHistoricos[$i + 1]->value : (string) $estadosHistoricos[$i + 1];
            $conteos[$desde][$hacia]++;
        }

        $matriz = [];
        foreach ($conteos as $desde => $transiciones) {
            $total = array_sum($transiciones);
            $matriz[$desde] = [];
            foreach ($transiciones as $hacia => $cantidad) {
                $matriz[$desde][$hacia] = $total > 0 ? round($cantidad / $total, 4) : $this->probabilidadBase($desde, $hacia);
            }
        }

        $probabilidades = $matriz[$estadoActual->value] ?? ['baja' => 0.25, 'media' => 0.50, 'alta' => 0.25];
        arsort($probabilidades);

        $periodos = count($estadosHistoricos);
        $confianza = match (true) {
            $periodos >= 4 => NivelConfianzaPrediccionEnum::ALTA,
            $periodos >= 2 => NivelConfianzaPrediccionEnum::MEDIA,
            default => NivelConfianzaPrediccionEnum::BAJA,
        };

        return new MatrizTransicionDemandaData(
            matriz: $matriz,
            probabilidades: $matriz[$estadoActual->value] ?? ['baja' => 0.25, 'media' => 0.50, 'alta' => 0.25],
            estadoPredicho: (string) array_key_first($probabilidades),
            nivelConfianza: $confianza->value,
            periodosHistoricos: $periodos,
        );
    }

    private function probabilidadBase(string $desde, string $hacia): float
    {
        if ($desde === $hacia) {
            return 0.50;
        }

        if ($hacia === EstadoDemandaEnum::MEDIA->value) {
            return 0.30;
        }

        return 0.20;
    }
}
