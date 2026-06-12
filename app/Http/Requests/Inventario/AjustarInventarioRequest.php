<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use Illuminate\Support\Facades\DB;

class AjustarInventarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('inventario.ajustar') ?? false;
    }

    public function rules(): array
    {
        return [
            'cod_categoria_producto' => ['required', 'exists:categorias_producto,cod_categoria_producto'],
            'tipo_ajuste' => ['required', 'in:entrada_fardo,salida_merma,ajuste_conteo,ajuste_minimo'],
            'cantidad' => ['required', 'integer', 'min:0'],
            'motivo_mov' => ['required', 'string', 'max:255'],
            'observacion_mov' => ['nullable', 'string'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->has('cod_categoria_producto') || $validator->errors()->has('cantidad')) {
                    return;
                }

                $codCategoria = $this->input('cod_categoria_producto');
                $tipoAjuste = $this->input('tipo_ajuste');
                $cantidad = $this->input('cantidad');

                if ($tipoAjuste === 'salida_merma') {
                    $stockTotal = (int) DB::table('inventarios as i')
                        ->join('productos as p', 'p.cod_producto', '=', 'i.cod_producto')
                        ->where('p.cod_categoria_producto', $codCategoria)
                        ->sum('i.stock_actual_inv');

                    $stockReservado = (int) DB::table('reservas_stock_carrito as r')
                        ->join('productos as p', 'p.cod_producto', '=', 'r.cod_producto')
                        ->where('p.cod_categoria_producto', $codCategoria)
                        ->where('r.estado_res', 'activa')
                        ->where('r.expira_en_res', '>', now())
                        ->sum('r.cantidad_res');

                    $disponibleAgrupado = max(0, $stockTotal - $stockReservado);

                    if ($cantidad > $disponibleAgrupado) {
                        $validator->errors()->add(
                            'cantidad',
                            "La cantidad a retirar ({$cantidad}) supera el stock disponible agrupado de la categoría ({$disponibleAgrupado})."
                        );
                    }
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'cod_categoria_producto.required' => 'La categoría es obligatoria.',
            'cod_categoria_producto.exists' => 'La categoría seleccionada no existe.',
            'tipo_ajuste.required' => 'El tipo de ajuste es obligatorio.',
            'tipo_ajuste.in' => 'El tipo de ajuste no es válido.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad no puede ser negativa.',
            'motivo_mov.required' => 'El motivo es obligatorio.',
            'motivo_mov.string' => 'El motivo debe ser texto.',
            'motivo_mov.max' => 'El motivo no puede superar los 255 caracteres.',
            'observacion_mov.string' => 'La observación debe ser texto.',
        ];
    }
}
