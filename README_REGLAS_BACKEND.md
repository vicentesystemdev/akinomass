# Reglas Backend AKINOMASS

## 1. Controladores delgados

Los controladores solo deben:

- Recibir la petición.
- Aplicar validación mediante FormRequest.
- Llamar una Action.
- Retornar respuesta Inertia o redirect.

No deben contener:

- Consultas complejas.
- Cálculos de negocio.
- Cambios de estado complejos.
- Lógica de inventario.
- Lógica de pagos.
- Lógica de reportes.

## 2. Actions

Una Action representa un caso de uso concreto.

Ejemplos:

- CrearPedidoAction
- ConfirmarPedidoAction
- RegistrarPagoAction
- ConvertirLeadEnClienteAction
- RegistrarMovimientoInventarioAction

La Action orquesta el caso de uso.

## 3. Services

Los Services contienen lógica de negocio reutilizable o compleja.

Ejemplos:

- PedidoService
- InventarioService
- ReporteComercialService
- AnalyticsGatewayService

No crear Services vacíos sin necesidad real.

## 4. Repositories

Los Repositories se usan para consultas reutilizables, filtros complejos o reportes.

No crear Repository si solo hará Model::find() o Model::create() sin lógica adicional.

## 5. DTOs

Los DTOs se usan para transportar datos limpios desde Requests hacia Actions y Services.

Los Services no deben depender directamente de objetos Request.

## 6. Enums

Los estados deben manejarse con Enums.

Ejemplos:

- EstadoLead
- EstadoPedido
- EstadoPago
- TipoMovimientoInventario
- TipoCanalVenta

No usar strings mágicos como "pagado", "Pagado" o "PAGADO" dispersos en el código.

## 7. Events y Listeners

Usar Events y Listeners para consecuencias secundarias.

Ejemplo:

PedidoConfirmado
→ DescontarStockListener
→ ActualizarDashboardComercialListener
→ RegistrarActividadEnBitacoraListener

No usar eventos para todo. Si una acción es obligatoria para completar el caso principal, puede llamarse directamente de forma controlada.

## 8. Comunicación entre dominios

Regla general:

- Un dominio puede llamar directamente a otro solo si es parte obligatoria del caso de uso principal.
- Las consecuencias secundarias deben comunicarse mediante eventos.
- Evitar dependencias circulares.
- Dashboard, Reportes y Analytics deben leer datos, pero no modificar procesos centrales.

## 9. Models

Los modelos Eloquent se mantienen en:

app/Models/

La lógica pesada no debe estar en los modelos.

Los modelos pueden tener:

- Relaciones.
- Casts.
- Scopes simples.
- Accessors simples.

## 10. Support vs Shared

Support:

- Utilidades técnicas genéricas.
- No conoce el negocio.

Shared:

- Elementos compartidos del negocio.
- Contracts.
- DTOs compartidos.
- Events transversales.
- Listeners transversales.

## 11. Redis

Redis se usa para:

- Cache.
- Sesiones.
- Colas.
- Dashboards comerciales.
- Reportes frecuentes.

No consultar dashboards pesados en tiempo real si pueden cachearse.

## 12. Seguridad

La seguridad se maneja en el dominio:

app/Domains/Seguridad/

Se usa Spatie Permission para:

- Roles.
- Permisos.
- Asignación de roles a usuarios.
- Control de acceso por módulo.

No crear sistema de roles manual si Spatie ya está instalado.

## Reglas para canales e interacciones

El sistema debe registrar canales de origen manualmente.

No crear servicios de integración externa como:

- WhatsAppApiService
- InstagramApiService
- FacebookApiService
- TikTokApiService
- TelegramBotService
- MarketplaceWebhookService

No crear webhooks externos para redes sociales en la primera versión.

Toda interacción debe poder asociarse a:

- Canal de origen.
- Tipo de flujo comercial.
- Lead.
- Cliente, si corresponde.
- Pedido, si corresponde.
- Usuario responsable.

## Reglas para ventas en vivo

El flujo de ventas en vivo debe estar separado de ventas convencionales.

Las ventas en vivo pueden tener sesiones, productos ofrecidos e interacciones rápidas.

No automatizar lectura de comentarios ni mensajes externos.

## Reglas para plantillas de mensajes

Las plantillas de mensajes deben ser entidades internas del sistema.

No deben enviar mensajes automáticamente.

No deben depender de APIs externas.

Deben permitir copiar, adaptar y usar manualmente el texto sugerido.
  