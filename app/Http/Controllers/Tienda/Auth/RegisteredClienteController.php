<?php

namespace App\Http\Controllers\Tienda\Auth;

use App\Domains\Tienda\Cuenta\Actions\CrearCuentaClienteAction;
use App\Domains\Tienda\Cuenta\DTOs\CrearCuentaClienteData;
use App\Domains\Tienda\Carrito\Actions\MergeCarritoInvitadoAction;
use App\Http\Controllers\Tienda\Auth\Concerns\RedirectsClienteTrasAutenticacion;
use App\Http\Controllers\Controller;
use App\Models\CanalVenta;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredClienteController extends Controller
{
    use RedirectsClienteTrasAutenticacion;
    public function create(): Response
    {
        return Inertia::render('Tienda/Auth/Register');
    }

    public function store(Request $request, CrearCuentaClienteAction $crearCuentaAction, MergeCarritoInvitadoAction $mergeCarritoAction): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'telefono_cli' => ['nullable', 'string', 'max:30'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        $canalWeb = Cache::rememberForever('lookup:canal_web', function () {
            $canal = CanalVenta::where('codigo_can', 'web')->first();
            if (!$canal) {
                throw new \RuntimeException('El canal de venta "web" no existe. Ejecuta: php artisan db:seed --class=CanalesVentaSeeder');
            }
            return $canal->cod_canal_venta;
        });

        $flujoCompraWeb = Cache::rememberForever('lookup:flujo_compra_web', function () {
            $flujo = TipoFlujoComercial::where('codigo_tip', 'compra_web')->first();
            if (!$flujo) {
                throw new \RuntimeException('El tipo de flujo comercial "compra_web" no existe. Ejecuta: php artisan db:seed --class=TiposFlujoComercialSeeder');
            }
            return $flujo->cod_tipo_flujo_comercial;
        });

        $crearCuentaAction->execute(CrearCuentaClienteData::fromArray([
            'user_id' => $user->id,
            'nombre_cli' => $user->name,
            'telefono_cli' => $request->telefono_cli,
            'correo_cli' => $user->email,
            'cod_canal_venta' => $canalWeb,
            'cod_tipo_flujo_comercial' => $flujoCompraWeb,
        ]));

        $user->assignRole('Cliente');

        event(new Registered($user));

        Auth::login($user);

        $user->load('cuentaCliente');

        $guestSessionId = $this->resolverIdSesionCarritoInvitado($request);
        $mergeCarritoAction->execute(
            $guestSessionId,
            $user->id,
            $user->cuentaCliente?->cod_cliente,
        );

        return $this->redirectTrasAutenticacionCliente($request);
    }
}
