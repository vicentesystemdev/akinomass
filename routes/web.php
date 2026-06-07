<?php

use App\Http\Controllers\ProfileController;

use App\Http\Controllers\CRM\ClienteController;
use App\Http\Controllers\CRM\LeadController;
use App\Http\Controllers\CRM\PlantillaMensajeController;
use App\Http\Controllers\Catalogo\CategoriaProductoController;
use App\Http\Controllers\Catalogo\ProductoController;
use App\Http\Controllers\Inventario\InventarioController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\Comercial\LiveSalesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\Auditoria\AuditoriaController;
use App\Http\Controllers\Tienda\AdminPedidoTiendaController;
use App\Http\Controllers\Tienda\AdminPagoTiendaController;
use App\Http\Controllers\Tienda\ConfiguracionTiendaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/tienda');
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified', 'redirect.cliente'])
    ->name('dashboard');

Route::middleware(['auth', 'redirect.cliente'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::resource('clientes', ClienteController::class)->except(['show', 'destroy']);
    Route::resource('leads', LeadController::class)->except(['show', 'destroy']);
    Route::resource('plantillas-mensaje', PlantillaMensajeController::class)->except(['show', 'destroy']);
    Route::patch('/plantillas-mensaje/{plantillas_mensaje}/toggle', [PlantillaMensajeController::class, 'toggle'])->name('plantillas-mensaje.toggle');
    Route::patch('/leads/{lead}/estado', [LeadController::class, 'updateEstado'])->name('leads.update-estado');
    Route::post('/leads/{lead}/convertir', [LeadController::class, 'convertir'])->name('leads.convertir');
    Route::resource('categorias-producto', CategoriaProductoController::class)->except(['destroy']);
    Route::resource('productos', ProductoController::class)->except(['show', 'destroy']);

    Route::get('/inventario', [InventarioController::class, 'index'])->name('inventario.index');
    Route::post('/inventario', [InventarioController::class, 'store'])->name('inventario.store');
    Route::get('/inventario/movimientos', [InventarioController::class, 'movimientos'])->name('inventario.movimientos');
    Route::get('/inventario/entrada', [InventarioController::class, 'entradaForm'])->name('inventario.entrada.form');
    Route::post('/inventario/entrada', [InventarioController::class, 'registrarEntrada'])->name('inventario.entrada');
    Route::get('/inventario/salida', [InventarioController::class, 'salidaForm'])->name('inventario.salida.form');
    Route::post('/inventario/salida', [InventarioController::class, 'registrarSalida'])->name('inventario.salida');
    Route::get('/inventario/ajuste', [InventarioController::class, 'ajusteForm'])->name('inventario.ajuste.form');
    Route::post('/inventario/ajuste', [InventarioController::class, 'registrarAjuste'])->name('inventario.ajuste');

    Route::resource('pedidos', PedidoController::class);
    Route::post('/pedidos/{pedido}/confirmar', [PedidoController::class, 'confirmar'])->name('pedidos.confirmar');
    Route::post('/pedidos/{pedido}/cancelar', [PedidoController::class, 'cancelar'])->name('pedidos.cancelar');


    Route::resource('live-sales', LiveSalesController::class);
    Route::patch('/live-sales/{live_sale}/estado', [LiveSalesController::class, 'cambiarEstado'])->name('live-sales.cambiar-estado');
    Route::post('/live-sales/{live_sale}/productos', [LiveSalesController::class, 'agregarProducto'])->name('live-sales.agregar-producto');
    Route::post('/live-sales/{live_sale}/interacciones', [LiveSalesController::class, 'registrarInteraccion'])->name('live-sales.registrar-interaccion');
    Route::post('/interacciones-live/{interaccion_live}/convertir-lead', [LiveSalesController::class, 'convertirLead'])->name('live-sales.convertir-lead');
    Route::post('/interacciones-live/{interaccion_live}/convertir-pedido', [LiveSalesController::class, 'convertirPedido'])->name('live-sales.convertir-pedido');

    Route::get('/pagos/{pago}/comprobante', \App\Http\Controllers\PagoComprobanteController::class)
        ->name('pagos.comprobante');
    Route::resource('pagos', PagoController::class);

    Route::get('/reportes', ReporteController::class)->name('reportes.index');
    Route::post('/pagos/{pago}/confirmar', [PagoController::class, 'confirmar'])->name('pagos.confirmar');
    Route::post('/pagos/{pago}/observar', [PagoController::class, 'observar'])->name('pagos.observar');
    Route::post('/pagos/{pago}/rechazar', [PagoController::class, 'rechazar'])->name('pagos.rechazar');

    Route::get('/auditoria', [AuditoriaController::class, 'index'])->name('auditoria.index');
    Route::get('/auditoria/{cod_auditoria}', [AuditoriaController::class, 'show'])->name('auditoria.show');

    Route::prefix('configuraciones/tienda')->middleware('role:Administrador')->group(function () {
        Route::get('/', [ConfiguracionTiendaController::class, 'index'])->name('configuracion.tienda.index');
        Route::patch('/', [ConfiguracionTiendaController::class, 'actualizar'])->name('configuracion.tienda.actualizar');
    });

    Route::prefix('admin/tienda/pedidos')->group(function () {
        Route::get('/{pedidoTienda}', [AdminPedidoTiendaController::class, 'show'])
            ->name('admin.tienda.pedidos.show');
        Route::post('/{pedidoTienda}/aceptar', [AdminPedidoTiendaController::class, 'aceptar'])
            ->name('admin.tienda.pedidos.aceptar');
        Route::post('/{pedidoTienda}/rechazar', [AdminPedidoTiendaController::class, 'rechazar'])
            ->name('admin.tienda.pedidos.rechazar');
    });

    Route::prefix('admin/tienda/pagos')->group(function () {
        Route::get('/{pago}', [AdminPagoTiendaController::class, 'show'])
            ->name('admin.tienda.pagos.show');
        Route::post('/{pago}/aceptar', [AdminPagoTiendaController::class, 'aceptar'])
            ->name('admin.tienda.pagos.aceptar');
        Route::post('/{pago}/observar', [AdminPagoTiendaController::class, 'observar'])
            ->name('admin.tienda.pagos.observar');
        Route::post('/{pago}/rechazar', [AdminPagoTiendaController::class, 'rechazar'])
            ->name('admin.tienda.pagos.rechazar');
    });

});

require __DIR__.'/auth.php';
