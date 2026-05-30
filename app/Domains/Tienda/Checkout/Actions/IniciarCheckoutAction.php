<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Checkout\DTOs\IniciarCheckoutData;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\Checkout\Services\CheckoutService;
use App\Models\Carrito;
use App\Models\CheckoutSesion;
use App\Models\CuentaCliente;
use Illuminate\Validation\ValidationException;

class IniciarCheckoutAction
{
    public function __construct(
        private CheckoutService $checkoutService,
    ) {}

    public function execute(int $userId, IniciarCheckoutData $data): CheckoutSesion
    {
        $cuentaCliente = CuentaCliente::where('user_id', $userId)->first();

        if (!$cuentaCliente) {
            throw ValidationException::withMessages([
                'usuario' => ['No tiene una cuenta de cliente activa.'],
            ]);
        }

        $carrito = Carrito::where('cod_carrito', $data->codCarrito)
            ->where('estado_car', EstadoCarritoEnum::ACTIVO)
            ->first();

        if (!$carrito) {
            throw ValidationException::withMessages([
                'carrito' => ['El carrito no está disponible.'],
            ]);
        }

        if ($carrito->detalles()->count() === 0) {
            throw ValidationException::withMessages([
                'carrito' => ['El carrito está vacío.'],
            ]);
        }

        $carrito->update(['estado_car' => EstadoCarritoEnum::EN_CHECKOUT]);

        $totales = $this->checkoutService->calcularTotales($carrito);

        $checkoutSesion = CheckoutSesion::create([
            'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
            'cod_carrito' => $carrito->cod_carrito,
            'estado_che' => EstadoCheckoutSesionEnum::INICIADO,
            'email_contacto_che' => $cuentaCliente->cliente->correo_cli ?? '',
            'subtotal_che' => $totales['subtotal'],
            'descuento_che' => $totales['descuento'],
            'impuesto_che' => $totales['impuesto'],
            'total_che' => $totales['total'],
            'expira_en_che' => now()->addHours(2),
        ]);

        return $checkoutSesion;
    }
}
