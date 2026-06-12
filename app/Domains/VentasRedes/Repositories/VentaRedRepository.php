<?php

namespace App\Domains\VentasRedes\Repositories;

use App\Domains\VentasRedes\DTOs\FiltroVentaRedData;
use App\Models\VentaRed;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class VentaRedRepository
{
    public function paginar(FiltroVentaRedData $filtros): LengthAwarePaginator
    {
        return VentaRed::query()
            ->with(['lead', 'cliente', 'canalVenta', 'tipoFlujoComercial', 'usuarioResponsable'])
            ->when($filtros->estado, fn ($query) => $query->where('estado_venta_red', $filtros->estado))
            ->when($filtros->codCanalVenta, fn ($query) => $query->where('cod_canal_venta', $filtros->codCanalVenta))
            ->when($filtros->tipoInteraccion, fn ($query) => $query->where('tipo_interaccion', $filtros->tipoInteraccion))
            ->when($filtros->codUsuarioResponsable, fn ($query) => $query->where('cod_usuario_responsable', $filtros->codUsuarioResponsable))
            ->when($filtros->desde, fn ($query) => $query->whereDate('created_at', '>=', $filtros->desde))
            ->when($filtros->hasta, fn ($query) => $query->whereDate('created_at', '<=', $filtros->hasta))
            ->when($filtros->busqueda, function ($query) use ($filtros): void {
                $query->where(function ($inner) use ($filtros): void {
                    $inner->where('codigo_venta_red', 'like', '%'.$filtros->busqueda.'%')
                        ->orWhere('referencia_origen', 'like', '%'.$filtros->busqueda.'%')
                        ->orWhereHas('lead', fn ($lead) => $lead->where('nombre_lea', 'like', '%'.$filtros->busqueda.'%'))
                        ->orWhereHas('cliente', fn ($cliente) => $cliente->where('nombre_cli', 'like', '%'.$filtros->busqueda.'%'));
                });
            })
            ->latest('cod_venta_red')
            ->paginate(15)
            ->withQueryString();
    }
}
