<?php

namespace App\Domains\InteligenciaVentas\Services;

use App\Models\Producto;

class ExplicacionPrediccionVentasService
{
    public function construir(Producto $producto, array $data): string
    {
        $canal = $data['canal_dominante'] ? " y el canal dominante es {$data['canal_dominante']} con {$data['porcentaje_canal_dominante']}% de participacion" : '';
        $cobertura = $data['ventas_estimadas_proximo_periodo'] > 0
            ? round(((int) $data['stock_actual'] / max(1, (int) $data['ventas_estimadas_proximo_periodo'])) * 100)
            : 100;

        if ((int) $data['cantidad_sugerida_abastecimiento'] > 0) {
            return "Se recomienda abastecer {$producto->nombre_pro} porque se proyecta una venta de {$data['ventas_estimadas_proximo_periodo']} unidades para el proximo periodo, el stock actual cubre aproximadamente {$cobertura}% de la demanda estimada, la demanda prevista es {$data['estado_demanda_predicho']}{$canal}.";
        }

        return "No se recomienda abastecer {$producto->nombre_pro} en este momento porque el stock actual cubre la demanda estimada para el proximo periodo y el nivel previsto de demanda es {$data['estado_demanda_predicho']}{$canal}.";
    }
}
