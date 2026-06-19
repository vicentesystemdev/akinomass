<?php

declare(strict_types=1);

namespace App\Http\Requests\InteligenciaVentas;

use Illuminate\Foundation\Http\FormRequest;

final class TendenciaVentasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('reportes.ver') ?? false;
    }

    public function rules(): array
    {
        return [
            'periodicidad' => ['nullable', 'in:semanal,mensual'],
            'metrica' => ['nullable', 'in:cantidad,monto'],
            'periodo_inicio' => ['nullable', 'date'],
            'periodo_fin' => ['nullable', 'date', 'after_or_equal:periodo_inicio'],
            'cod_categoria_producto' => ['nullable', 'integer', 'exists:categorias_producto,cod_categoria_producto'],
            'cod_producto' => ['nullable', 'integer', 'exists:productos,cod_producto'],
            'cod_canal_venta' => ['nullable', 'integer', 'exists:canales_venta,cod_canal_venta'],
        ];
    }
}
