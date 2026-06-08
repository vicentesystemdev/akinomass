<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Carrito\Actions\ActualizarCantidadCarritoAction;
use App\Domains\Tienda\Carrito\Actions\AgregarItemCarritoAction;
use App\Domains\Tienda\Carrito\Actions\EliminarItemCarritoAction;
use App\Domains\Tienda\Carrito\Actions\VaciarCarritoAction;
use App\Domains\Tienda\Carrito\DTOs\AgregarItemCarritoData;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;
use App\Domains\Tienda\Mensajes\TiendaMensajeService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\ActualizarCantidadCarritoRequest;
use App\Http\Requests\Tienda\AgregarItemCarritoRequest;
use App\Models\Carrito;
use App\Models\DetalleCarrito;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class CarritoController extends Controller
{
    public function index(
        Request $request,
        CarritoPersistenciaService $service,
        ReservaStockCarritoService $reservaService,
        ConfiguracionTiendaService $configService,
        TiendaMensajeService $mensajeService,
    ): Response|JsonResponse|RedirectResponse {
        $carrito = $this->resolverCarrito($request, $service);
        $carrito = $carrito ? $carrito->load(['detalles.producto', 'detalles.variante.talla']) : null;

        if ($request->expectsJson()) {
            $data = ['carrito' => $carrito];

            if ($carrito) {
                $reservasActivas = $reservaService->reservasActivasPorCarrito($carrito);
                $reservaMasAntigua = $carrito->reservas()
                    ->where('estado_res', 'activa')
                    ->where('expira_en_res', '>', now())
                    ->orderBy('expira_en_res', 'asc')
                    ->first();

                $data['reservas'] = [
                    'cantidad_reservas_activas' => $reservasActivas,
                    'expiracion_reserva' => $reservaMasAntigua?->expira_en_res,
                    'tiempo_restante_segundos' => $reservaMasAntigua
                        ? $mensajeService->obtenerTiempoRestanteSegundos($reservaMasAntigua->expira_en_res)
                        : 0,
                    'tiempo_restante_formateado' => $reservaMasAntigua
                        ? $mensajeService->formatearTiempoRestante(
                            $mensajeService->obtenerTiempoRestanteSegundos($reservaMasAntigua->expira_en_res)
                        )
                        : 'Sin reserva',
                    'mensaje_reserva' => $reservasActivas > 0
                        ? 'Tus productos están reservados por tiempo limitado.'
                        : 'No tienes productos reservados.',
                    'ttl_minutos' => $configService->obtenerTiempoReservaCarritoMinutos(),
                ];
            }

            return response()->json($data);
        }

        return redirect()->route('tienda.catalogo')->with('open_cart', true);
    }

    public function agregarItem(
        Request $request,
        AgregarItemCarritoRequest $formRequest,
        AgregarItemCarritoAction $action,
        CarritoPersistenciaService $service,
        ReservaStockCarritoService $reservaService,
        ConfiguracionTiendaService $configService,
        TiendaMensajeService $mensajeService,
    ): RedirectResponse|JsonResponse {
        $carrito = $this->resolverOCrearCarrito($request, $service);

        $data = AgregarItemCarritoData::fromArray($formRequest->validated());

        $detalle = $action->execute($carrito, $data);
        $carrito = $carrito->fresh()->load(['detalles.variante.talla']);

        if ($request->expectsJson()) {
            $reservasActivas = $reservaService->reservasActivasPorCarrito($carrito);
            $reservaMasAntigua = $carrito->reservas()
                ->where('estado_res', 'activa')
                ->where('expira_en_res', '>', now())
                ->orderBy('expira_en_res', 'asc')
                ->first();

            return response()->json([
                'mensaje' => 'Producto agregado al carrito.',
                'detalle' => $detalle,
                'carrito' => $carrito,
                'reservas' => [
                    'cantidad_reservas_activas' => $reservasActivas,
                    'expiracion_reserva' => $reservaMasAntigua?->expira_en_res,
                    'tiempo_restante_segundos' => $reservaMasAntigua
                        ? $mensajeService->obtenerTiempoRestanteSegundos($reservaMasAntigua->expira_en_res)
                        : 0,
                    'mensaje_reserva' => 'Tus productos están reservados por tiempo limitado.',
                ],
            ]);
        }

        return redirect()->back()->with('success', 'Producto agregado al carrito.');
    }

    public function actualizarItem(
        Request $request,
        Producto $producto,
        ActualizarCantidadCarritoRequest $formRequest,
        ActualizarCantidadCarritoAction $action,
        CarritoPersistenciaService $service,
        ReservaStockCarritoService $reservaService,
        TiendaMensajeService $mensajeService,
    ): RedirectResponse|JsonResponse {
        $carrito = $this->resolverCarrito($request, $service);

        if (! $carrito) {
            if ($request->expectsJson()) {
                return response()->json(['mensaje' => 'Carrito no encontrado.'], 404);
            }

            return redirect()->back()->with('error', 'Carrito no encontrado.');
        }

        $detalle = DetalleCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->where('cod_producto', $producto->cod_producto)
            ->when($request->integer('cod_variante_producto'), fn ($query, $codVariante) => $query->where('cod_variante_producto', $codVariante), fn ($query) => $query->whereNull('cod_variante_producto'))
            ->firstOrFail();

        $action->execute($detalle, $formRequest->validated('cantidad'));

        if ($request->expectsJson()) {
            $carritoFresh = $carrito->fresh()->load(['detalles.variante.talla']);
            $reservasActivas = $reservaService->reservasActivasPorCarrito($carritoFresh);
            $reservaMasAntigua = $carritoFresh->reservas()
                ->where('estado_res', 'activa')
                ->where('expira_en_res', '>', now())
                ->orderBy('expira_en_res', 'asc')
                ->first();

            return response()->json([
                'mensaje' => 'Cantidad actualizada.',
                'carrito' => $carritoFresh,
                'reservas' => [
                    'cantidad_reservas_activas' => $reservasActivas,
                    'expiracion_reserva' => $reservaMasAntigua?->expira_en_res,
                    'tiempo_restante_segundos' => $reservaMasAntigua
                        ? $mensajeService->obtenerTiempoRestanteSegundos($reservaMasAntigua->expira_en_res)
                        : 0,
                ],
            ]);
        }

        return redirect()->back()->with('success', 'Cantidad actualizada.');
    }

    public function eliminarItem(
        Request $request,
        Producto $producto,
        EliminarItemCarritoAction $action,
        CarritoPersistenciaService $service,
        ReservaStockCarritoService $reservaService,
        TiendaMensajeService $mensajeService,
    ): RedirectResponse|JsonResponse {
        $carrito = $this->resolverCarrito($request, $service);

        if (! $carrito) {
            if ($request->expectsJson()) {
                return response()->json(['mensaje' => 'Carrito no encontrado.'], 404);
            }

            return redirect()->back()->with('error', 'Carrito no encontrado.');
        }

        $detalle = DetalleCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->where('cod_producto', $producto->cod_producto)
            ->when($request->integer('cod_variante_producto'), fn ($query, $codVariante) => $query->where('cod_variante_producto', $codVariante), fn ($query) => $query->whereNull('cod_variante_producto'))
            ->firstOrFail();

        $action->execute($detalle);

        if ($request->expectsJson()) {
            $carritoFresh = $carrito->fresh()->load(['detalles.variante.talla']);
            $reservasActivas = $reservaService->reservasActivasPorCarrito($carritoFresh);

            return response()->json([
                'mensaje' => 'Producto eliminado del carrito.',
                'carrito' => $carritoFresh,
                'reservas' => [
                    'cantidad_reservas_activas' => $reservasActivas,
                ],
            ]);
        }

        return redirect()->back()->with('success', 'Producto eliminado del carrito.');
    }

    public function vaciar(
        Request $request,
        VaciarCarritoAction $action,
        CarritoPersistenciaService $service,
    ): RedirectResponse|JsonResponse {
        $carrito = $this->resolverCarrito($request, $service);

        if (! $carrito) {
            if ($request->expectsJson()) {
                return response()->json(['mensaje' => 'Carrito no encontrado.'], 404);
            }

            return redirect()->back()->with('error', 'Carrito no encontrado.');
        }

        $action->execute($carrito);

        if ($request->expectsJson()) {
            return response()->json([
                'mensaje' => 'Carrito vaciado.',
                'carrito' => $carrito->fresh()->load('detalles'),
                'reservas' => [
                    'cantidad_reservas_activas' => 0,
                ],
            ]);
        }

        return redirect()->back()->with('success', 'Carrito vaciado.');
    }

    private function resolverCarrito(Request $request, CarritoPersistenciaService $service): ?Carrito
    {
        if ($request->user()) {
            return $service->obtenerPorUserId($request->user()->id);
        }

        return $service->obtenerPorSessionId($this->sessionIdCarritoInvitado($request));
    }

    private function resolverOCrearCarrito(Request $request, CarritoPersistenciaService $service): Carrito
    {
        $carrito = $this->resolverCarrito($request, $service);

        if (! $carrito) {
            $userId = $request->user()?->id;
            $sessionId = $request->user() ? null : $this->sessionIdCarritoInvitado($request);
            $codCliente = $request->user()?->cuentaCliente?->cod_cliente;

            $carrito = $service->crear($userId, $sessionId, $codCliente);
        }

        return $carrito;
    }

    private function sessionIdCarritoInvitado(Request $request): string
    {
        return $request->session()->get('carrito_session_id', $request->session()->getId());
    }
}
