<?php

namespace App\Http\Controllers\Tienda\Auth;

use App\Domains\Tienda\Carrito\Actions\MergeCarritoInvitadoAction;
use App\Http\Controllers\Tienda\Auth\Concerns\RedirectsClienteTrasAutenticacion;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedClienteController extends Controller
{
    use RedirectsClienteTrasAutenticacion;
    public function create(): Response
    {
        return Inertia::render('Tienda/Auth/Login');
    }

    public function store(Request $request, MergeCarritoInvitadoAction $mergeCarritoAction): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'Las credenciales proporcionadas no son correctas.',
            ]);
        }

        $user = Auth::user();

        if (!$user->hasRole('Cliente')) {
            Auth::logout();
            return redirect('/login');
        }

        $request->session()->regenerate();

        $user->load('cuentaCliente');

        $guestSessionId = $this->resolverIdSesionCarritoInvitado($request);
        $mergeCarritoAction->execute(
            $guestSessionId,
            $user->id,
            $user->cuentaCliente?->cod_cliente,
        );

        return $this->redirectTrasAutenticacionCliente($request);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/tienda');
    }
}
