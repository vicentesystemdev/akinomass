# Dominio Inventario

Este dominio contiene la lógica relacionada con stock, movimientos, ajustes, disponibilidad y control de inventario.

## Responsabilidades

- Control de stock.
- Registro de movimientos de inventario.
- Entradas y salidas de productos.
- Ajustes manuales.
- Verificación de disponibilidad.
- Alertas de bajo stock.
- Reacción a eventos comerciales como pedido confirmado o pedido cancelado.

## Reglas

- No manejar stock como un simple número sin historial.
- Todo cambio de stock debe generar un movimiento de inventario.
- Inventario puede escuchar eventos del dominio Comercial.
- Si Comercial necesita validar disponibilidad, debe depender de un contrato o servicio controlado, no de una implementación desordenada.
- Las acciones secundarias deben manejarse mediante eventos y listeners.

## Ejemplo

PedidoConfirmado → Listener de Inventario → Registrar salida de stock
