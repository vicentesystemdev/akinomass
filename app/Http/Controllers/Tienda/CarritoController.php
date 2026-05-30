<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Carrito\Actions\ActualizarCantidadCarritoAction;
use App\Domains\Tienda\Carrito\Actions\AgregarItemCarritoAction;
use App\Domains\Tienda\Carrito\Actions\EliminarItemCarritoAction;
use App\Domains\Tienda\Carrito\Actions\VaciarCarritoAction;
use App\Domains\Tienda\Carrito\DTOs\AgregarItemCarritoData;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\ActualizarCantidadCarritoRequest;
use App\Http\Requests\Tienda\AgregarItemCarritoRequest;
use App\Models\Carrito;
use App\Models\DetalleCarrito;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarritoController extends Controller
{
    public function index(Request $request, CarritoPersistenciaService $service): Response|JsonResponse
    {
        $carrito = $this->resolverCarrito($request, $service);
        $carrito = $carrito ? $carrito->load('detalles.producto') : null;

        if ($request->expectsJson()) {
            return response()->json(['carrito' => $carrito]);
        }

        return Inertia::render('Tienda/Carrito', [
            'carrito' => $carrito,
        ]);
    }

    public function agregarItem(
        Request $request,
        AgregarItemCarritoRequest $formRequest,
        AgregarItemCarritoAction $action,
        CarritoPersistenciaService $service,
    ): RedirectResponse|JsonResponse {
        $carrito = $this->resolverOCrearCarrito($request, $service);

        $data = AgregarItemCarritoData::fromArray($formRequest->validated());

        $detalle = $action->execute($carrito, $data);
        $carrito = $carrito->fresh()->load('detalles');

        if ($request->expectsJson()) {
            return response()->json([
                'mensaje' => 'Producto agregado al carrito.',
                'detalle' => $detalle,
                'carrito' => $carrito,
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
    ): RedirectResponse|JsonResponse {
        $carrito = $this->resolverCarrito($request, $service);

        if (!$carrito) {
            if ($request->expectsJson()) {
                return response()->json(['mensaje' => 'Carrito no encontrado.'], 404);
            }

            return redirect()->back()->with('error', 'Carrito no encontrado.');
        }

        $detalle = DetalleCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->where('cod_producto', $producto->cod_producto)
            ->firstOrFail();

        $action->execute($detalle, $formRequest->validated('cantidad'));

        if ($request->expectsJson()) {
            return response()->json([
                'mensaje' => 'Cantidad actualizada.',
                'carrito' => $carrito->fresh()->load('detalles'),
            ]);
        }

        return redirect()->back()->with('success', 'Cantidad actualizada.');
    }

    public function eliminarItem(
        Request $request,
        Producto $producto,
        EliminarItemCarritoAction $action,
        CarritoPersistenciaService $service,
    ): RedirectResponse|JsonResponse {
        $carrito = $this->resolverCarrito($request, $service);

        if (!$carrito) {
            if ($request->expectsJson()) {
                return response()->json(['mensaje' => 'Carrito no encontrado.'], 404);
            }

            return redirect()->back()->with('error', 'Carrito no encontrado.');
        }

        $detalle = DetalleCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->where('cod_producto', $producto->cod_producto)
            ->firstOrFail();

        $action->execute($detalle);

        if ($request->expectsJson()) {
            return response()->json([
                'mensaje' => 'Producto eliminado del carrito.',
                'carrito' => $carrito->fresh()->load('detalles'),
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

        if (!$carrito) {
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

        if (!$carrito) {
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
