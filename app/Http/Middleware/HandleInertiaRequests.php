<?php

namespace App\Http\Middleware;

use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;
use App\Domains\Tienda\Mensajes\TiendaMensajeService;
use App\Models\Carrito;
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
            'carrito_reservas' => fn () => $this->resolverReservasCarritoTienda($request),
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

        return $carrito->load(['detalles.variante.talla'])->toArray();
    }

    private function resolverReservasCarritoTienda(Request $request): ?array
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

        return $this->construirReservasData($carrito);
    }

    private function construirReservasData(Carrito $carrito): array
    {
        $reservaService = app(ReservaStockCarritoService::class);
        $configService = app(ConfiguracionTiendaService::class);
        $mensajeService = app(TiendaMensajeService::class);

        $reservasActivas = $reservaService->reservasActivasPorCarrito($carrito);
        $reservaMasAntigua = $carrito->reservas()
            ->where('estado_res', 'activa')
            ->where('expira_en_res', '>', now())
            ->orderBy('expira_en_res', 'asc')
            ->first();

        $segundos = $reservaMasAntigua
            ? $mensajeService->obtenerTiempoRestanteSegundos($reservaMasAntigua->expira_en_res)
            : 0;

        return [
            'cantidad_reservas_activas' => $reservasActivas,
            'expiracion_reserva' => $reservaMasAntigua?->expira_en_res,
            'tiempo_restante_segundos' => $segundos,
            'tiempo_restante_formateado' => $reservaMasAntigua
                ? $mensajeService->formatearTiempoRestante($segundos)
                : 'Sin reserva',
            'mensaje_reserva' => $reservasActivas > 0
                ? 'Tus productos están reservados por tiempo limitado.'
                : 'No tienes productos reservados.',
            'ttl_minutos' => $configService->obtenerTiempoReservaCarritoMinutos(),
        ];
    }
}
