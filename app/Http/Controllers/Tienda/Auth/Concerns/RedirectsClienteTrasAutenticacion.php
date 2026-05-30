<?php

namespace App\Http\Controllers\Tienda\Auth\Concerns;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

trait RedirectsClienteTrasAutenticacion
{
    protected function redirectTrasAutenticacionCliente(Request $request): RedirectResponse
    {
        $intended = $request->session()->pull('url.intended');

        $destino = ($intended && str_starts_with($intended, '/tienda'))
            ? $intended
            : '/tienda';

        return redirect($destino);
    }

    protected function resolverIdSesionCarritoInvitado(Request $request): string
    {
        return $request->session()->get('carrito_session_id', $request->session()->getId());
    }
}
