<?php

use App\Http\Controllers\Tienda\Auth\AuthenticatedClienteController;
use App\Http\Controllers\Tienda\Auth\RegisteredClienteController;
use App\Http\Controllers\Tienda\CarritoController;
use App\Http\Controllers\Tienda\CatalogoPublicoController;
use App\Http\Controllers\Tienda\CuentaClienteDashboardController;
use App\Http\Controllers\Tienda\CheckoutController;
use App\Http\Controllers\Tienda\DireccionClienteController;
use App\Http\Controllers\Tienda\FacturaWebController;
use App\Http\Controllers\Tienda\PagoWebController;
use App\Http\Controllers\Tienda\PedidoWebController;
use App\Http\Middleware\CarritoSessionMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas Tienda Online
|--------------------------------------------------------------------------
|
| Rutas para el storefront B2C de AKINOMASS.
| Acceso público para catálogo, autenticado para checkout y cuenta.
|
*/

Route::middleware(CarritoSessionMiddleware::class)->group(function () {
    // Catálogo público (sin auth)
    Route::get('/tienda', [CatalogoPublicoController::class, 'index'])->name('tienda.home');
    Route::get('/tienda/catalogo', [CatalogoPublicoController::class, 'index'])->name('tienda.catalogo');
    Route::get('/tienda/productos/{producto}', [CatalogoPublicoController::class, 'show'])->name('tienda.producto.show');
    Route::get('/tienda/categorias/{categoria}', [CatalogoPublicoController::class, 'porCategoria'])->name('tienda.categoria.show');

    // Carrito (público para invitados + autenticados)
    Route::prefix('tienda/carrito')->group(function () {
        Route::get('/', [CarritoController::class, 'index'])->name('tienda.carrito');
        Route::post('/items', [CarritoController::class, 'agregarItem'])->name('tienda.carrito.agregar');
        Route::patch('/items/{producto}', [CarritoController::class, 'actualizarItem'])->name('tienda.carrito.actualizar');
        Route::delete('/items/{producto}', [CarritoController::class, 'eliminarItem'])->name('tienda.carrito.eliminar');
        Route::delete('/', [CarritoController::class, 'vaciar'])->name('tienda.carrito.vaciar');
    });

    // Auth tienda (guest)
    Route::middleware('guest')->group(function () {
        Route::get('/tienda/login', [AuthenticatedClienteController::class, 'create'])->name('tienda.login');
        Route::post('/tienda/login', [AuthenticatedClienteController::class, 'store'])->name('tienda.login.store');
        Route::get('/tienda/registro', [RegisteredClienteController::class, 'create'])->name('tienda.registro');
        Route::post('/tienda/registro', [RegisteredClienteController::class, 'store'])->name('tienda.registro.store');
    });

    // Logout
    Route::post('/tienda/logout', [AuthenticatedClienteController::class, 'destroy'])
        ->middleware('auth')
        ->name('tienda.logout');

    // Rutas autenticadas con rol Cliente
    Route::middleware(['auth', 'verified', 'role:Cliente'])->group(function () {
        // Checkout
        Route::prefix('tienda/checkout')->group(function () {
            Route::post('/', [CheckoutController::class, 'iniciar'])->name('tienda.checkout.iniciar');
            Route::get('/{token}', [CheckoutController::class, 'show'])->name('tienda.checkout.show');
            Route::patch('/{token}/datos', [CheckoutController::class, 'actualizarDatos'])->name('tienda.checkout.datos');
            Route::post('/{token}/cancelar', [CheckoutController::class, 'cancelar'])->name('tienda.checkout.cancelar');
            Route::post('/{token}/volver-carrito', [CheckoutController::class, 'volverAlCarrito'])->name('tienda.checkout.volver-carrito');
            Route::post('/{token}/cancelar-compra', [CheckoutController::class, 'cancelarCompra'])->name('tienda.checkout.cancelar-compra');
            Route::post('/{token}/extender-reservas', [CheckoutController::class, 'extenderReservas'])->name('tienda.checkout.extender-reservas');
            Route::post('/{token}/recalcular', [CheckoutController::class, 'recalcularTotales'])->name('tienda.checkout.recalcular');
            Route::post('/{token}/generar-pedido', [PedidoWebController::class, 'generar'])->name('tienda.checkout.generar-pedido');
            Route::post('/{token}/pago', [PagoWebController::class, 'registrar'])->name('tienda.checkout.pago');
        });

        // Pedidos cliente
        Route::get('/tienda/mis-pedidos', [PedidoWebController::class, 'index'])->name('tienda.cuenta.pedidos');
        Route::get('/tienda/mis-pedidos/{pedido}', [PedidoWebController::class, 'show'])->name('tienda.cuenta.pedido.show');
        Route::get('/tienda/mis-pedidos/{pedido}/pago', [PagoWebController::class, 'show'])->name('tienda.cuenta.pago.show');
        Route::get('/tienda/mis-pedidos/{pedido}/factura', [FacturaWebController::class, 'show'])->name('tienda.cuenta.factura.show');
        Route::post('/tienda/pagos/{pagoTienda}/resubir', [PagoWebController::class, 'resubir'])->name('tienda.pago.resubir');

        // Cuenta
        Route::get('/tienda/mi-cuenta', [CuentaClienteDashboardController::class, 'index'])
            ->name('tienda.cuenta');

        Route::get('/tienda/mis-direcciones', [DireccionClienteController::class, 'index'])
            ->name('tienda.cuenta.direcciones');
        Route::post('/tienda/mis-direcciones', [DireccionClienteController::class, 'store'])
            ->name('tienda.cuenta.direcciones.store');
        Route::patch('/tienda/mis-direcciones/{direccion}', [DireccionClienteController::class, 'update'])
            ->name('tienda.cuenta.direcciones.update');
        Route::delete('/tienda/mis-direcciones/{direccion}', [DireccionClienteController::class, 'destroy'])
            ->name('tienda.cuenta.direcciones.destroy');
        Route::patch('/tienda/mis-direcciones/{direccion}/predeterminada', [DireccionClienteController::class, 'marcarPredeterminada'])
            ->name('tienda.cuenta.direcciones.predeterminada');
    });
});
