<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfCliente
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->hasRole('Cliente')) {
            return redirect('/tienda');
        }

        return $next($request);
    }
}
