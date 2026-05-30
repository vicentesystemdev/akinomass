<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CarritoSessionMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->session()->has('carrito_session_id')) {
            $request->session()->put('carrito_session_id', $request->session()->getId());
        }

        return $next($request);
    }
}
