# Dominio CRM

Este dominio contiene la lógica relacionada con la gestión comercial de clientes y leads.

Su objetivo es centralizar el seguimiento de interesados provenientes de canales como TikTok LIVE, WhatsApp, Instagram, Facebook y Telegram, permitiendo convertir leads en clientes y clientes en pedidos.

## Responsabilidades

- Registro y actualización de clientes.
- Registro y seguimiento de leads.
- Conversión de leads en clientes.
- Historial comercial básico.
- Estados de leads y clientes.
- Relación de clientes y leads con canales de venta.
- Métricas comerciales iniciales de captación y conversión.

## Submódulos

- Clientes
- Leads

## Reglas

- La lógica de conversión de lead a cliente debe vivir en Actions y Services del dominio CRM.
- Los estados de leads deben definirse mediante Enums.
- CRM puede escuchar eventos de Comercial, por ejemplo cuando un pago confirmado afecta el valor comercial de un cliente.
- CRM no debe modificar directamente procesos internos de Inventario o Pagos.
