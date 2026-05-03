<?php

namespace App\Http\Requests\Pagos;

use App\Domains\Comercial\Pagos\Enums\MetodoPagoEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StorePagoRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->can('pagos.registrar') ?? false; }

    public function rules(): array
    {
        return [
            'cod_pedido' => ['required', 'exists:pedidos,cod_pedido'],
            'metodo_pago_pag' => ['required', new Enum(MetodoPagoEnum::class)],
            'monto_pag' => ['required', 'numeric', 'gt:0'],
            'referencia_pag' => ['nullable', 'string', 'max:150'],
            'fecha_pago_pag' => ['nullable', 'date'],
            'observacion_pag' => ['nullable', 'string'],
        ];
    }
}
