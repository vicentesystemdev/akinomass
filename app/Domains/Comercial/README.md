# Dominio Comercial

Este dominio contiene la lógica relacionada con canales de venta, pedidos y pagos.

Representa el núcleo operativo de las ventas de AKINOMASS.

## Responsabilidades

- Gestión de canales de venta.
- Registro de pedidos.
- Confirmación y cancelación de pedidos.
- Registro y confirmación de pagos.
- Relación entre pedidos, clientes, productos y canales.
- Control de estados comerciales.
- Emisión de eventos cuando ocurren cambios importantes en pedidos o pagos.

## Submódulos

- Canales
- Pedidos
- Pagos

## Reglas

- Un pedido no debe descontar inventario directamente desde el controlador.
- La confirmación de un pedido debe realizarse mediante una Action.
- La lógica compleja de pedido y pago debe vivir en Services.
- Los cambios relevantes deben emitir eventos, por ejemplo `PedidoConfirmado` o `PagoConfirmado`.
- Las consecuencias secundarias deben manejarse mediante Listeners en otros dominios.
