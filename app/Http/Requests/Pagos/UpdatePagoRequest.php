<?php

namespace App\Http\Requests\Pagos;

class UpdatePagoRequest extends StorePagoRequest
{
    public function authorize(): bool { return $this->user()?->can('pagos.registrar') ?? false; }

    public function rules(): array
    {
        $rules = parent::rules();
        unset($rules['cod_pedido']);
        return $rules;
    }
}
