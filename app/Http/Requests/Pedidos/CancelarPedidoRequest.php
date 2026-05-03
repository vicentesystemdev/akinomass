<?php
namespace App\Http\Requests\Pedidos;
use Illuminate\Foundation\Http\FormRequest;
class CancelarPedidoRequest extends FormRequest { public function authorize(): bool { return $this->user()?->can('pedidos.cancelar') ?? false; } public function rules(): array { return []; }}
