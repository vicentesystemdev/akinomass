<?php

namespace App\Http\Middleware;

use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user()
                    ? [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'roles' => $request->user()->getRoleNames()->values()->all(),
                    ]
                    : null,
                'permissions' => fn () => $request->user()
                    ? $request->user()->getAllPermissions()->pluck('name')->values()->all()
                    : [],
            ],
            'carrito' => fn () => $this->resolverCarritoTienda($request),
            'flash' => [
                'open_cart' => fn () => $request->session()->get('open_cart'),
            ],
        ];
    }

    private function resolverCarritoTienda(Request $request): ?array
    {
        if (! str_starts_with($request->path(), 'tienda')) {
            return null;
        }

        $service = app(CarritoPersistenciaService::class);
        $sessionId = $request->session()->get('carrito_session_id', $request->session()->getId());

        $carrito = $request->user()
            ? $service->obtenerPorUserId($request->user()->id)
            : $service->obtenerPorSessionId($sessionId);

        if (! $carrito) {
            return null;
        }

        return $carrito->load('detalles')->toArray();
    }
}
