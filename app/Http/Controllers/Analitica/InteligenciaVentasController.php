<?php

namespace App\Http\Controllers\Analitica;

use App\Domains\InteligenciaVentas\Actions\ActualizarConfiguracionInteligenciaVentasAction;
use App\Domains\InteligenciaVentas\Actions\AnalizarSegmentacionClientesAction;
use App\Domains\InteligenciaVentas\Actions\AnalizarTendenciaVentasAction;
use App\Domains\InteligenciaVentas\Actions\GenerarPrediccionVentasAction;
use App\Domains\InteligenciaVentas\Actions\LimpiarPrediccionesVentasAction;
use App\Domains\InteligenciaVentas\Actions\ListarAnalisisCanalesAction;
use App\Domains\InteligenciaVentas\Actions\ListarConclusionesInteligenciaVentasAction;
use App\Domains\InteligenciaVentas\Actions\ListarPrediccionesCategoriasAction;
use App\Domains\InteligenciaVentas\Actions\ListarPrediccionesProductosAction;
use App\Domains\InteligenciaVentas\Actions\ListarRecomendacionesAbastecimientoAction;
use App\Domains\InteligenciaVentas\Actions\ListarResumenInteligenciaVentasAction;
use App\Domains\InteligenciaVentas\Repositories\ConfiguracionInteligenciaVentasRepository;
use App\Http\Controllers\Controller;
use App\Http\Requests\InteligenciaVentas\ActualizarConfiguracionInteligenciaVentasRequest;
use App\Http\Requests\InteligenciaVentas\GenerarPrediccionVentasRequest;
use App\Http\Requests\InteligenciaVentas\SegmentacionClientesRequest;
use App\Http\Requests\InteligenciaVentas\TendenciaVentasRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InteligenciaVentasController extends Controller
{
    public function index(ListarResumenInteligenciaVentasAction $resumen, ListarPrediccionesProductosAction $productos): Response
    {
        $this->authorize('reportes.ver');

        return Inertia::render('InteligenciaVentas/Resumen', [
            'titulo' => 'Resumen de Inteligencia de Ventas',
            'resumen' => $resumen->execute(),
            'predicciones' => $productos->execute()->take(20)->values(),
        ]);
    }

    public function categorias(ListarPrediccionesCategoriasAction $action): Response
    {
        $this->authorize('reportes.ver');

        return Inertia::render('InteligenciaVentas/Categorias', [
            'titulo' => 'Prediccion por Categorias',
            'categorias' => $action->execute(),
        ]);
    }

    public function productos(Request $request, ListarPrediccionesProductosAction $action): Response
    {
        $this->authorize('reportes.ver');

        $filtros = $request->only([
            'cod_categoria_producto',
            'cod_producto',
            'cod_canal_venta',
            'nivel_recomendacion',
            'nivel_riesgo_stock',
            'periodo_inicio',
            'periodo_fin',
        ]);

        return Inertia::render('InteligenciaVentas/Productos', [
            'titulo' => 'Prediccion por Productos',
            'predicciones' => $action->execute($request->all()),
            'filtros' => $filtros,
        ]);
    }

    public function abastecimiento(ListarRecomendacionesAbastecimientoAction $action): Response
    {
        $this->authorize('reportes.ver');

        return Inertia::render('InteligenciaVentas/Abastecimiento', [
            'titulo' => 'Recomendacion de Abastecimiento',
            'predicciones' => $action->execute(),
        ]);
    }

    public function canales(ListarAnalisisCanalesAction $action): Response
    {
        $this->authorize('reportes.ver');

        return Inertia::render('InteligenciaVentas/Canales', [
            'titulo' => 'Analisis por Canales',
            'canales' => $action->execute(),
        ]);
    }

    public function conclusiones(Request $request, ListarConclusionesInteligenciaVentasAction $action): Response
    {
        $this->authorize('reportes.ver');

        $filtros = $request->only([
            'tipo_analisis',
            'horizonte_meses',
            'temporada',
            'cod_categoria_producto',
            'cod_canal_venta',
            'nivel_riesgo_stock',
            'nivel_recomendacion',
        ]);

        return Inertia::render('InteligenciaVentas/Conclusiones', [
            'titulo' => 'Conclusiones de Inteligencia de Ventas',
            'conclusiones' => $action->execute($filtros),
        ]);
    }

    public function configuracion(ConfiguracionInteligenciaVentasRepository $repository): Response
    {
        $this->authorize('reportes.ver');

        return Inertia::render('InteligenciaVentas/Configuracion', [
            'titulo' => 'Configuracion de Inteligencia de Ventas',
            'configuracion' => $repository->activa(),
        ]);
    }

    public function segmentacionClientes(
        SegmentacionClientesRequest $request,
        AnalizarSegmentacionClientesAction $action,
    ): Response {
        return Inertia::render('InteligenciaVentas/SegmentacionClientes', [
            'titulo' => 'Segmentación de Clientes mediante K-Means',
            'segmentacion' => $action->execute($request->validated()),
        ]);
    }

    public function tendenciasRegresion(
        TendenciaVentasRequest $request,
        AnalizarTendenciaVentasAction $action,
    ): Response {
        return Inertia::render('InteligenciaVentas/TendenciasRegresion', [
            'titulo' => 'Tendencias de Ventas mediante Regresión Lineal',
            'tendencia' => $action->execute($request->validated()),
        ]);
    }

    public function generar(GenerarPrediccionVentasRequest $request, GenerarPrediccionVentasAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('inteligencia-ventas.index');
    }

    public function limpiar(LimpiarPrediccionesVentasAction $action): RedirectResponse
    {
        $this->authorize('reportes.ver');
        $action->execute();

        return redirect()->route('inteligencia-ventas.index');
    }

    public function actualizarConfiguracion(ActualizarConfiguracionInteligenciaVentasRequest $request, ActualizarConfiguracionInteligenciaVentasAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('inteligencia-ventas.configuracion');
    }
}
