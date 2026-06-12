<?php

namespace App\Http\Requests\VentasRedes;

use App\Domains\VentasRedes\Enums\EstadoVentaRedEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CambiarEstadoVentaRedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('pedidos.editar') ?? false;
    }

    public function rules(): array
    {
        return [
            'estado_venta_red' => ['required', Rule::enum(EstadoVentaRedEnum::class)],
        ];
    }
}
