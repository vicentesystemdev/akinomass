<?php
namespace App\Http\Requests\Pedidos;
use Illuminate\Foundation\Http\FormRequest;
class StorePedidoRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('pedidos.crear') ?? false; }
 public function rules(): array { return ['cod_cliente'=>['required','exists:clientes,cod_cliente'],'cod_canal_venta'=>['required','exists:canales_venta,cod_canal_venta'],'cod_tipo_flujo_comercial'=>['required','exists:tipos_flujo_comercial,cod_tipo_flujo_comercial'],'fecha_pedido_ped'=>['nullable','date'],'descuento_ped'=>['nullable','numeric','min:0'],'observacion_ped'=>['nullable','string'],'detalles'=>['required','array','min:1'],'detalles.*.cod_producto'=>['required','exists:productos,cod_producto'],'detalles.*.cantidad_det'=>['required','integer','min:1'],'detalles.*.precio_unitario_det'=>['required','numeric','min:0']]; }
}
