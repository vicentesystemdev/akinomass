<?php

namespace App\Http\Controllers\Inventario;

use App\Domains\Inventario\Actions\CrearOActualizarInventarioAction;
use App\Domains\Inventario\Actions\RegistrarAjusteInventarioAction;
use App\Domains\Inventario\Actions\RegistrarEntradaInventarioAction;
use App\Domains\Inventario\Actions\RegistrarSalidaInventarioAction;
use App\Domains\Inventario\Services\ConsultaInventarioCategoriaService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventario\AjustarInventarioRequest;
use App\Http\Requests\Inventario\RegistrarMovimientoInventarioRequest;
use App\Http\Requests\Inventario\StoreInventarioRequest;
use App\Models\CategoriaProducto;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    public function index(Request $request, ConsultaInventarioCategoriaService $consulta): Response
    {
        $this->authorize('inventario.ver');

        $categorias = $consulta->categorias();
        $codCategoria = $request->integer('cod_categoria_producto') ?: null;

        return Inertia::render('Inventario/Index', [
            'categorias' => $categorias,
            'detalleCategoria' => $codCategoria ? $consulta->detalle($codCategoria) : null,
            'kpis' => $consulta->kpis(),
        ]);
    }

    public function movimientos(Request $request): Response
    {
        $this->authorize('inventario.movimientos');

        $codCategoria = $request->integer('cod_categoria_producto') ?: null;
        $movimientos = MovimientoInventario::query()
            ->with(['producto.categoria', 'inventario.variante.talla', 'usuarioResponsable'])
            ->when($codCategoria, fn ($query) => $query->whereHas(
                'producto',
                fn ($producto) => $producto->where('cod_categoria_producto', $codCategoria),
            ))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Inventario/Movimientos', [
            'movimientos' => $movimientos,
            'categorias' => CategoriaProducto::query()
                ->orderBy('nombre_cat')
                ->get(['cod_categoria_producto', 'nombre_cat']),
            'filtros' => ['cod_categoria_producto' => $codCategoria],
        ]);
    }

    public function entradaForm()
    {
        return redirect()->route('inventario.ajuste.form', ['tipo' => 'entrada_fardo']);
    }

    public function salidaForm()
    {
        return redirect()->route('inventario.ajuste.form', ['tipo' => 'salida_merma']);
    }

    public function ajusteForm(Request $request): Response
    {
        $this->authorize('inventario.ajustar');

        $consulta = app(ConsultaInventarioCategoriaService::class);
        $categoriasModel = CategoriaProducto::query()
            ->where('activo_cat', true)
            ->orderBy('nombre_cat')
            ->get();

        $resumenes = $consulta->resumenesPorCategoria($categoriasModel->pluck('cod_categoria_producto'));

        $categorias = $categoriasModel->map(function ($cat) use ($resumenes) {
            $res = $resumenes->get($cat->cod_categoria_producto);
            return [
                'cod_categoria_producto' => $cat->cod_categoria_producto,
                'nombre_cat' => $cat->nombre_cat,
                'stock_total' => $res ? (int) $res['stock_total'] : 0,
                'stock_reservado' => $res ? (int) $res['stock_reservado'] : 0,
                'stock_disponible' => $res ? (int) $res['stock_disponible'] : 0,
                'stock_minimo' => $res ? (int) $res['stock_minimo'] : 0,
            ];
        });

        return Inertia::render('Inventario/Ajustar', [
            'categorias' => $categorias,
            'codCategoriaSeleccionada' => $request->integer('cod_categoria_producto') ?: null,
            'tipoSeleccionado' => $request->input('tipo') ?: null,
        ]);
    }

    private function obtenerProductoRepresentativo(int $codCategoria): Producto
    {
        $categoria = CategoriaProducto::findOrFail($codCategoria);
        $sku = 'GEN-CAT-' . $codCategoria;
        
        $producto = Producto::where('sku_pro', $sku)->first();
        
        if (! $producto) {
            $producto = Producto::create([
                'cod_categoria_producto' => $codCategoria,
                'nombre_pro' => 'Stock Agrupado - ' . $categoria->nombre_cat,
                'descripcion_pro' => 'Producto virtual representativo del stock agrupado de la categoría ' . $categoria->nombre_cat . '.',
                'precio_venta_pro' => 0.0,
                'precio_costo_pro' => 0.0,
                'sku_pro' => $sku,
                'estado_pro' => \App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum::ACTIVO,
            ]);

            \App\Models\Inventario::create([
                'cod_producto' => $producto->cod_producto,
                'stock_actual_inv' => 0,
                'stock_minimo_inv' => 0,
                'ubicacion_inv' => 'Almacén 1',
                'activo_inv' => true,
            ]);
        }
        
        return $producto;
    }

    public function store(StoreInventarioRequest $request, CrearOActualizarInventarioAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('inventario.index');
    }

    public function registrarEntrada(RegistrarMovimientoInventarioRequest $request, RegistrarEntradaInventarioAction $action)
    {
        $action->execute($request->validated(), $request->user()?->id);

        return redirect()->route('inventario.index');
    }

    public function registrarSalida(RegistrarMovimientoInventarioRequest $request, RegistrarSalidaInventarioAction $action)
    {
        $action->execute($request->validated(), $request->user()?->id);

        return redirect()->route('inventario.index');
    }

    public function registrarAjuste(AjustarInventarioRequest $request)
    {
        $data = $request->validated();
        $codCategoria = $data['cod_categoria_producto'];
        
        $productoRepresentativo = $this->obtenerProductoRepresentativo($codCategoria);
        $codProducto = $productoRepresentativo->cod_producto;
        
        $tipoAjuste = $data['tipo_ajuste'];
        $cantidad = $data['cantidad'];
        $motivo = $data['motivo_mov'];
        $observacion = $data['observacion_mov'] ?? null;
        $codUsuario = $request->user()?->id;

        \Illuminate\Support\Facades\DB::transaction(function () use ($codProducto, $tipoAjuste, $cantidad, $motivo, $observacion, $codUsuario) {
            $inventarioService = app(\App\Domains\Inventario\Services\InventarioService::class);
            $auditoriaService = app(\App\Domains\Auditoria\Services\RegistrarAuditoriaService::class);

            if ($tipoAjuste === 'ajuste_minimo') {
                $inventarioService->crearOActualizarInventario([
                    'cod_producto' => $codProducto,
                    'stock_minimo_inv' => $cantidad,
                    'ubicacion_inv' => 'Almacén 1',
                ]);

                $contexto = \App\Domains\Auditoria\DTOs\RegistrarAuditoriaData::fromRequest(request());
                $auditoriaService->registrarAccion(
                    $contexto, 'Inventario', 'inventarios', (string) $codProducto, 'update',
                    submodulo: 'Ajuste Mínimo',
                    accionFuncional: 'Ajuste de stock mínimo por categoría',
                    descripcion: "Se ajustó el stock mínimo agrupado de la categoría a {$cantidad}.",
                );
                return;
            }

            $tipoMov = match ($tipoAjuste) {
                'entrada_fardo' => \App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum::ENTRADA,
                'salida_merma' => \App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum::SALIDA,
                'ajuste_conteo' => \App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum::AJUSTE,
            };

            $inventarioService->registrarMovimiento(
                codProducto: $codProducto,
                tipo: $tipoMov,
                cantidad: $tipoAjuste === 'ajuste_conteo' ? 0 : $cantidad,
                motivo: $motivo,
                observacion: $observacion,
                codUsuario: $codUsuario,
                stockAjuste: $tipoAjuste === 'ajuste_conteo' ? $cantidad : null,
            );

            $submodulo = match ($tipoAjuste) {
                'entrada_fardo' => 'Entrada Fardo',
                'salida_merma' => 'Salida Merma',
                'ajuste_conteo' => 'Ajuste Conteo',
            };

            $contexto = \App\Domains\Auditoria\DTOs\RegistrarAuditoriaData::fromRequest(request());
            $auditoriaService->registrarAccion(
                $contexto, 'Inventario', 'movimientos_inventario', (string) $codProducto, 'update',
                submodulo: $submodulo,
                accionFuncional: 'Ajuste de inventario agrupado',
                descripcion: "Movimiento de tipo {$tipoAjuste} por cantidad {$cantidad} en la categoría.",
            );
        });

        return redirect()->route('inventario.index')->with('success', 'Inventario actualizado correctamente.');
    }
}
