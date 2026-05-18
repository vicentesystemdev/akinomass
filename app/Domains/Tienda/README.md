# Dominio Tienda (Storefront B2C)

Lógica del **front-office**: catálogo público, carrito, checkout, pedidos/pagos web y facturación.

## Documentación de sprints

Ver raíz del proyecto: [README_TIENDA_ONLINE.md](../../README_TIENDA_ONLINE.md)

## Subdominios

| Carpeta | Responsabilidad |
|---------|-----------------|
| `Catalogo/` | Lectura pública productos |
| `Carrito/` | Redis + `carritos` |
| `Checkout/` | `checkout_sesiones` |
| `Cuenta/` | `cuentas_cliente`, direcciones |
| `PedidosWeb/` | `pedidos_tienda` |
| `PagosWeb/` | `pagos_tienda` |
| `Facturacion/` | `facturas` |

## Reglas

- Reutilizar `CrearPedidoAction`, `RegistrarPagoAction`, `ConfirmarPedidoAction` del dominio Comercial.
- No modificar tablas `clientes`, `pedidos`, `pagos` existentes (solo INSERT vía Actions).
- Cliente = rol Spatie `Cliente`, no permisos admin.
