<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PagoComprobanteController extends Controller
{
    public function __invoke(Pago $pago): StreamedResponse
    {
        $this->authorize('pagos.ver');

        $pagoTienda = $pago->pagoTienda;

        abort_unless($pagoTienda?->comprobante_ruta_pwe, 404);

        $disk = Storage::disk('local');

        abort_unless($disk->exists($pagoTienda->comprobante_ruta_pwe), 404);

        return $disk->response(
            $pagoTienda->comprobante_ruta_pwe,
            basename($pagoTienda->comprobante_ruta_pwe),
            ['Content-Disposition' => 'inline']
        );
    }
}
