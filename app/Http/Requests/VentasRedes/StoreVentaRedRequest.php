<?php

namespace App\Http\Requests\VentasRedes;

use App\Domains\VentasRedes\Enums\EstadoVentaRedEnum;
use App\Domains\VentasRedes\Enums\TipoInteraccionVentaRedEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVentaRedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('pedidos.crear') ?? false;
    }

    public function rules(): array
    {
        return [
            'cod_lead' => ['nullable', 'exists:leads,cod_lead'],
            'cod_cliente' => ['nullable', 'exists:clientes,cod_cliente'],
            'cod_canal_venta' => ['required', 'exists:canales_venta,cod_canal_venta'],
            'cod_tipo_flujo_comercial' => ['nullable', 'exists:tipos_flujo_comercial,cod_tipo_flujo_comercial'],
            'cod_usuario_responsable' => ['nullable', 'exists:users,id'],
            'estado_venta_red' => ['required', Rule::enum(EstadoVentaRedEnum::class)],
            'tipo_interaccion' => ['nullable', Rule::enum(TipoInteraccionVentaRedEnum::class)],
            'referencia_origen' => ['nullable', 'string', 'max:255'],
            'observacion' => ['nullable', 'string'],
            'descuento' => ['nullable', 'numeric', 'min:0'],
            'detalles' => ['nullable', 'array'],
            'detalles.*.cod_producto' => ['required_with:detalles', 'exists:productos,cod_producto'],
            'detalles.*.cod_variante_producto' => ['nullable', 'exists:variantes_producto,cod_variante_producto'],
            'detalles.*.cod_talla_producto' => ['nullable', 'exists:tallas_producto,cod_talla_producto'],
            'detalles.*.cantidad' => ['required_with:detalles', 'integer', 'min:1'],
            'detalles.*.precio_unitario' => ['required_with:detalles', 'numeric', 'min:0'],
            'detalles.*.observacion' => ['nullable', 'string'],
        ];
    }
}
