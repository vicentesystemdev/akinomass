<?php

namespace App\Domains\VentasRedes\Services;

use App\Domains\VentasRedes\Enums\EstadoVentaRedEnum;
use App\Domains\Tienda\Carrito\Services\StockDisponibleTiendaService;
use App\Models\Producto;
use App\Models\VentaRed;
use App\Models\VarianteProducto;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class VentaRedService
{
    public function __construct(
        private readonly TotalesVentaRedService $totalesService,
        private readonly StockDisponibleTiendaService $stockDisponibleService,
    ) {}

    public function crear(array $data): VentaRed
    {
        $detalles = $data['detalles'] ?? [];
        unset($data['detalles']);

        $data['codigo_venta_red'] = $data['codigo_venta_red'] ?? $this->generarCodigo();
        $data['cod_usuario_responsable'] = $data['cod_usuario_responsable'] ?? auth()->id();

        $this->validarContacto($data);
        $detalles = $this->normalizarDetalles($detalles);

        return DB::transaction(function () use ($data, $detalles): VentaRed {
            $totales = $this->totalesService->calcular($detalles, (float) ($data['descuento'] ?? 0));

            $ventaRed = VentaRed::create([
                ...$data,
                'subtotal' => $totales['subtotal'],
                'descuento' => $totales['descuento'],
                'total' => $totales['total'],
            ]);

            if ($detalles !== []) {
                $ventaRed->detalles()->createMany($totales['detalles']);
            }

            return $ventaRed->refresh()->load('detalles');
        });
    }

    public function actualizar(VentaRed $ventaRed, array $data): VentaRed
    {
        if (in_array($ventaRed->estado_venta_red, [EstadoVentaRedEnum::CONVERTIDA_PEDIDO, EstadoVentaRedEnum::CANCELADA], true)) {
            $permitidos = array_intersect_key($data, array_flip(['observacion', 'referencia_origen']));
            $ventaRed->update($permitidos);

            return $ventaRed->refresh();
        }

        $this->validarContacto($data);

        $ventaRed->update($data);

        return $this->totalesService->recalcular($ventaRed);
    }

    public function cambiarEstado(VentaRed $ventaRed, EstadoVentaRedEnum $estado): VentaRed
    {
        if ($ventaRed->estado_venta_red === EstadoVentaRedEnum::CONVERTIDA_PEDIDO) {
            throw new RuntimeException('La venta ya fue convertida a pedido.');
        }

        if ($ventaRed->estado_venta_red === EstadoVentaRedEnum::CANCELADA && $estado !== EstadoVentaRedEnum::CANCELADA) {
            throw new RuntimeException('No se puede reactivar una venta cancelada desde este flujo.');
        }

        $ventaRed->update(['estado_venta_red' => $estado]);

        return $ventaRed->refresh();
    }

    public function confirmar(VentaRed $ventaRed): VentaRed
    {
        if ($ventaRed->estado_venta_red === EstadoVentaRedEnum::CANCELADA) {
            throw new RuntimeException('No se puede confirmar una venta cancelada.');
        }

        if ($ventaRed->detalles()->count() === 0) {
            throw ValidationException::withMessages([
                'detalles' => ['Agrega al menos un producto para confirmar la venta.'],
            ]);
        }

        $ventaRed->update([
            'estado_venta_red' => EstadoVentaRedEnum::CONFIRMADA,
            'fecha_confirmacion' => now(),
        ]);

        return $ventaRed->refresh();
    }

    public function cancelar(VentaRed $ventaRed): VentaRed
    {
        if ($ventaRed->estado_venta_red === EstadoVentaRedEnum::CONVERTIDA_PEDIDO) {
            throw new RuntimeException('No se puede cancelar una venta ya convertida a pedido.');
        }

        $ventaRed->update(['estado_venta_red' => EstadoVentaRedEnum::CANCELADA]);

        return $ventaRed->refresh();
    }

    public function generarCodigo(): string
    {
        $next = (int) VentaRed::max('cod_venta_red') + 1;

        return 'VR-'.str_pad((string) $next, 6, '0', STR_PAD_LEFT);
    }

    private function validarContacto(array $data): void
    {
        $estado = $data['estado_venta_red'] ?? EstadoVentaRedEnum::BORRADOR->value;

        if ($estado !== EstadoVentaRedEnum::BORRADOR->value && empty($data['cod_lead']) && empty($data['cod_cliente'])) {
            throw ValidationException::withMessages([
                'contacto' => ['Selecciona un lead o cliente para continuar.'],
            ]);
        }
    }

    private function normalizarDetalles(array $detalles): array
    {
        return array_map(function (array $detalle): array {
            $producto = Producto::where('cod_producto', $detalle['cod_producto'] ?? null)
                ->where('estado_pro', 'activo')
                ->first();

            if (! $producto) {
                throw ValidationException::withMessages([
                    'detalles' => ['Uno de los productos no esta disponible en catalogo.'],
                ]);
            }

            $variante = null;
            if (! empty($detalle['cod_variante_producto'])) {
                $variante = VarianteProducto::where('cod_variante_producto', $detalle['cod_variante_producto'])
                    ->where('cod_producto', $producto->cod_producto)
                    ->first();

                if (! $variante) {
                    throw ValidationException::withMessages([
                        'detalles' => ['Una variante no pertenece al producto seleccionado.'],
                    ]);
                }
            }

            $cantidad = (int) ($detalle['cantidad'] ?? 0);
            if (! $this->stockDisponibleService->estaDisponible($producto->cod_producto, $cantidad, $variante?->cod_variante_producto)) {
                $disponible = $this->stockDisponibleService->obtenerStockDisponible($producto->cod_producto, $variante?->cod_variante_producto);

                throw ValidationException::withMessages([
                    'detalles' => ["Stock insuficiente para {$producto->nombre_pro}. Disponible: {$disponible}."],
                ]);
            }

            $precio = (float) ($detalle['precio_unitario'] ?? $variante?->precio_venta_variante ?? $producto->precio_venta_pro);

            return [
                'cod_producto' => $producto->cod_producto,
                'cod_variante_producto' => $variante?->cod_variante_producto,
                'cod_talla_producto' => $variante?->cod_talla_producto ?? ($detalle['cod_talla_producto'] ?? null),
                'cantidad' => $cantidad,
                'precio_unitario' => $precio,
                'observacion' => $detalle['observacion'] ?? null,
            ];
        }, $detalles);
    }
}
