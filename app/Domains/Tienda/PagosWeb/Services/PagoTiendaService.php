<?php

namespace App\Domains\Tienda\PagosWeb\Services;

use App\Models\CheckoutSesion;
use App\Models\PagoTienda;
use App\Models\PedidoTienda;

class PagoTiendaService
{
    public function resolverPedidoTienda(int $codCheckoutSesion): ?PedidoTienda
    {
        return PedidoTienda::where('cod_checkout_sesion', $codCheckoutSesion)->first();
    }

    public function guardarComprobante(int $codPago, $archivo): string
    {
        $ruta = "comprobantes/{$codPago}";
        $nombre = hash_file('sha256', $archivo->getRealPath()) . '.' . $archivo->getClientOriginalExtension();

        $archivo->storeAs($ruta, $nombre, 'local');

        return $ruta . '/' . $nombre;
    }
}
