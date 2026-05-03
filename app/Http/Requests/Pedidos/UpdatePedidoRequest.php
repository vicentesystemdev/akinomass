<?php
namespace App\Http\Requests\Pedidos;
use Illuminate\Foundation\Http\FormRequest;
class UpdatePedidoRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('pedidos.editar') ?? false; }
 public function rules(): array { return (new StorePedidoRequest())->rules(); }
}
