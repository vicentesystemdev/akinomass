<?php
namespace App\Http\Requests\LiveSales; use Illuminate\Foundation\Http\FormRequest;
class StoreProductoLiveRequest extends FormRequest{ public function authorize():bool{return $this->user()?->can('productos.ver')??false;} public function rules():array{return ['cod_producto'=>['required','exists:productos,cod_producto'],'orden_proliv'=>['nullable','integer','min:1'],'precio_live_proliv'=>['nullable','numeric','min:0'],'observacion_proliv'=>['nullable','string']];}}
