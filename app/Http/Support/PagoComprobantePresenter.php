<?php

namespace App\Http\Support;

use App\Models\Pago;

class PagoComprobantePresenter
{
    public static function for(Pago $pago): array
    {
        $pagoTienda = $pago->relationLoaded('pagoTienda')
            ? $pago->pagoTienda
            : $pago->pagoTienda()->first();

        $esOrigenTienda = $pagoTienda !== null;
        $ruta = $pagoTienda?->comprobante_ruta_pwe;

        if (!$ruta) {
            return [
                'tiene' => false,
                'origen_tienda' => $esOrigenTienda,
                'url' => null,
                'es_imagen' => false,
                'es_pdf' => false,
                'nombre' => null,
                'fecha_subida' => null,
            ];
        }

        $extension = strtolower(pathinfo($ruta, PATHINFO_EXTENSION));

        return [
            'tiene' => true,
            'origen_tienda' => $esOrigenTienda,
            'url' => route('pagos.comprobante', $pago->cod_pago),
            'es_imagen' => in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true),
            'es_pdf' => $extension === 'pdf',
            'nombre' => basename($ruta),
            'fecha_subida' => $pagoTienda->fecha_subida_comprobante_pwe?->toIso8601String(),
        ];
    }
}
