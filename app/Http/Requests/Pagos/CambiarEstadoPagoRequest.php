<?php

namespace App\Http\Requests\Pagos;

use Illuminate\Foundation\Http\FormRequest;

class CambiarEstadoPagoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('pagos.confirmar') || $this->user()?->can('pagos.rechazar') || false;
    }

    public function rules(): array
    {
        return [];
    }
}
