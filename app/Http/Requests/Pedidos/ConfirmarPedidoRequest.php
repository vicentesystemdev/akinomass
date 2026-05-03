<?php
namespace App\Http\Requests\Pedidos;
use Illuminate\Foundation\Http\FormRequest;
class ConfirmarPedidoRequest extends FormRequest { public function authorize(): bool { return $this->user()?->can('pedidos.confirmar') ?? false; } public function rules(): array { return []; }}
