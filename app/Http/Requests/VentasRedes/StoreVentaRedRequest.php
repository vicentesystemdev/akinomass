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

    protected function prepareForValidation(): void
    {
        $this->merge([
            'cod_lead' => $this->input('cod_lead') ?: null,
            'cod_cliente' => $this->input('cod_cliente') ?: null,
            'cod_canal_venta' => $this->input('cod_canal_venta') ?: null,
            'cod_tipo_flujo_comercial' => $this->input('cod_tipo_flujo_comercial') ?: null,
            'cod_usuario_responsable' => $this->input('cod_usuario_responsable') ?: null,
        ]);
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $codLead = $this->input('cod_lead');
            $codCliente = $this->input('cod_cliente');

            if (empty($codLead) && empty($codCliente)) {
                $validator->errors()->add('contacto', 'Debe seleccionar un lead o un cliente.');
            }

            if (!empty($codLead) && !empty($codCliente)) {
                $validator->errors()->add('contacto', 'Debe seleccionar solo un contacto: lead o cliente, no ambos.');
            }
        });
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
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.cod_producto' => ['required_with:detalles', 'exists:productos,cod_producto'],
            'detalles.*.cod_variante_producto' => ['nullable', 'exists:variantes_producto,cod_variante_producto'],
            'detalles.*.cod_talla_producto' => ['nullable', 'exists:tallas_producto,cod_talla_producto'],
            'detalles.*.cantidad' => ['required_with:detalles', 'integer', 'min:1'],
            'detalles.*.precio_unitario' => ['required_with:detalles', 'numeric', 'min:0'],
            'detalles.*.observacion' => ['nullable', 'string'],
        ];
    }
}
