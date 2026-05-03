<?php

use App\Http\Controllers\ProfileController;

use App\Http\Controllers\CRM\ClienteController;
use App\Http\Controllers\CRM\LeadController;
use App\Http\Controllers\Catalogo\CategoriaProductoController;
use App\Http\Controllers\Catalogo\ProductoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::resource('clientes', ClienteController::class)->except(['show', 'destroy']);
    Route::resource('leads', LeadController::class)->except(['show', 'destroy']);
    Route::patch('/leads/{lead}/estado', [LeadController::class, 'updateEstado'])->name('leads.update-estado');
    Route::post('/leads/{lead}/convertir', [LeadController::class, 'convertir'])->name('leads.convertir');
    Route::resource('categorias-producto', CategoriaProductoController::class)->except(['show', 'destroy']);
    Route::resource('productos', ProductoController::class)->except(['show', 'destroy']);
});

require __DIR__.'/auth.php';
