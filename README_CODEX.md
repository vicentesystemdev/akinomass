# Instrucciones para Codex - AKINOMASS

# Regla prioritaria sobre pruebas y entorno Codex

El entorno de Codex puede no tener disponibles las dependencias completas del proyecto, especialmente el directorio `vendor/`, Composer, Node, npm, Redis o la base de datos PostgreSQL.

Por esta razón, cualquier instrucción de este documento que solicite ejecutar comandos de verificación debe interpretarse como una indicación para el desarrollador local, no como una obligación estricta para Codex.

Codex debe priorizar:

- Crear o modificar los archivos solicitados.
- Mantener el código sintácticamente correcto.
- Respetar la arquitectura definida.
- No alterar el proyecto para intentar corregir limitaciones de su propio entorno.
- Indicar al final los comandos que el desarrollador debe ejecutar localmente.

Si Codex encuentra errores como:

`````txt
vendor/autoload.php not found
composer: command not found
npm: command not found
database connection failed
Redis connection failed

Este proyecto es AKINOMASS, un sistema web comercial multicanal para centralizar ventas, clientes, leads, pedidos, productos, inventario, pagos, reportes y dashboards.

El objetivo de este documento es definir reglas obligatorias para que Codex implemente el sistema respetando la arquitectura acordada, sin inventar estructuras, integraciones externas o lógica desordenada.

---

# 1. Stack instalado

El proyecto ya cuenta con:

- Laravel 13
- PHP 8.3
- PostgreSQL
- Redis
- Laravel Queue con Redis
- Cache con Redis
- Sesiones con Redis
- Spatie Permission
- Laravel Sanctum
- Laravel Breeze
- Inertia.js
- React
- Tailwind CSS
- Vite
- Ziggy
- Axios

---
# Regla de nomenclatura de base de datos

Para las tablas propias del negocio de AKINOMASS, se debe usar nomenclatura en español en la medida de lo posible.

Esta regla aplica a tablas creadas para los módulos propios del sistema, como:

- clientes
- leads
- canales_venta
- tipos_flujo_comercial
- productos
- categorias_producto
- inventarios
- movimientos_inventario
- pedidos
- detalles_pedido
- pagos
- sesiones_live
- plantillas_mensaje

No aplica a tablas internas de Laravel, Breeze, Sanctum o Spatie Permission, las cuales deben conservar sus nombres originales para evitar conflictos con el framework y los paquetes instalados.

Ejemplos de tablas que NO deben renombrarse:

- users
- password_reset_tokens
- sessions
- cache
- jobs
- roles
- permissions
- model_has_roles
- model_has_permissions
- role_has_permissions

## Convención de atributos

Los atributos de tablas propias del negocio deben seguir la estructura:

nombreDelAtributo_abreviaturaTabla

Ejemplos:

Tabla `clientes`:

- nombre_cli
- telefono_cli
- correo_cli
- estado_cli

Tabla `canales_venta`:

- nombre_can
- codigo_can
- descripcion_can
- activo_can

Tabla `tipos_flujo_comercial`:

- nombre_tip
- codigo_tip
- descripcion_tip
- activo_tip

Tabla `productos`:

- nombre_pro
- descripcion_pro
- precio_pro
- estado_pro

## Claves primarias

Para tablas propias del negocio se recomienda usar claves primarias con el formato:

cod_nombre_singular

Ejemplos:

- cod_cliente
- cod_lead
- cod_canal_venta
- cod_tipo_flujo_comercial
- cod_producto
- cod_pedido
- cod_pago

Si se usa una clave primaria personalizada, el modelo Eloquent debe declarar correctamente:

- protected $primaryKey
- public $incrementing
- protected $keyType si corresponde

## Timestamps

Se pueden mantener los timestamps estándar de Laravel:

- created_at
- updated_at

Esto se permite para mantener compatibilidad con Eloquent y evitar complejidad innecesaria.

## Regla importante

Codex no debe modificar tablas internas existentes de Laravel, Breeze, Sanctum o Spatie.

La convención en español aplica solamente a nuevas tablas de negocio creadas para AKINOMASS.

# 2. Tipo de arquitectura

AKINOMASS utiliza:

- MVC de Laravel como base.
- Monolito modular.
- Arquitectura por capas.
- Organización por dominios funcionales en `app/Domains`.
- Events y Listeners para comunicación secundaria entre dominios.
- Jobs para procesos pesados o diferidos.
- Redis para cache, sesiones, colas y dashboards.
- Preparación futura para FastAPI como servicio analítico paralelo.

No es una arquitectura de microservicios en la primera versión.

---

# 3. Estructura principal

La lógica de negocio debe organizarse principalmente en:

````txt
app/Domains/
├── Seguridad/
├── CRM/
├── Comercial/
├── Catalogo/
├── Inventario/
├── Reportes/
├── Dashboard/
├── Analytics/
└── Shared/

Los modelos Eloquent se mantienen en:

app/Models/

Los controladores se mantienen en:

app/Http/Controllers/

Las utilidades técnicas genéricas se mantienen en:

app/Support/
# 4. Flujo obligatorio de backend

El flujo recomendado es:

Controller → FormRequest → DTO → Action → Service → Repository → Model

No todos los casos necesitan obligatoriamente todas las capas, pero si existe lógica de negocio importante debe respetarse este flujo.

# 5. Reglas obligatorias de arquitectura
No colocar lógica de negocio en controladores.
No crear consultas complejas en controladores.
No colocar lógica pesada en modelos.
Usar Actions para casos de uso concretos.
Usar Services para lógica compleja, reutilizable o integraciones.
Usar Repositories solo cuando existan consultas complejas, filtros reutilizables o reportes.
Usar DTOs para pasar datos limpios entre Requests, Actions y Services.
Usar Enums para estados.
Usar Events y Listeners para consecuencias secundarias.
Usar Jobs para procesos pesados, diferidos o que actualicen dashboards/reportes.
No mover modelos fuera de app/Models.
No mover controladores fuera de app/Http/Controllers.
No modificar configuración de Redis sin autorización.
No implementar FastAPI todavía.
No crear otra estructura distinta a app/Domains.
No eliminar README.md ni .gitkeep sin reemplazar por archivos reales.
No crear sistema manual de roles y permisos fuera de Spatie Permission.
No cambiar el stack instalado.
No hacer diseño visual avanzado salvo estructura base.
Mantener compatibilidad con Inertia React.
No implementar APIs externas de redes sociales, mensajería, marketplaces ni bots en la primera versión.
Diferenciar siempre canal de origen y tipo de flujo comercial.
Las plantillas de mensajes son sugerencias manuales, no automatizaciones de envío.
El flujo de ventas en vivo debe ser configurable y manual, orientado inicialmente a TikTok LIVE.
No crear microservicios ni servicios externos sin instrucción explícita.
No modificar .env.
No modificar configuración sensible del proyecto sin justificarlo.
No duplicar lógica entre dominios.
No crear carpetas nuevas fuera de la arquitectura sin necesidad clara.
No usar strings mágicos para estados de leads, pedidos, pagos o inventario.
# 6. Responsabilidad de cada capa
Controller

El Controller solo debe:

Recibir la petición.
Usar FormRequest cuando corresponda.
Validar permisos o middleware.
Llamar una Action.
Retornar respuesta Inertia, redirect o JSON si corresponde.

No debe:

Calcular totales.
Cambiar estados complejos.
Descontar inventario.
Confirmar pagos con lógica interna.
Crear reportes pesados.
Ejecutar consultas complejas.
FormRequest

El FormRequest debe validar datos de entrada.

Ejemplos:

CrearClienteRequest
RegistrarLeadRequest
CrearPedidoRequest
RegistrarPagoRequest
AjustarStockRequest
DTO

Los DTOs deben transportar datos limpios hacia Actions y Services.

Los Services no deben depender directamente de objetos Request.

Ejemplo:

CrearPedidoRequest → CrearPedidoData → CrearPedidoAction
Action

Una Action representa un caso de uso concreto.

Ejemplos:

CrearClienteAction
RegistrarLeadAction
ConvertirLeadEnClienteAction
CrearPedidoAction
ConfirmarPedidoAction
CancelarPedidoAction
RegistrarPagoAction
ConfirmarPagoAction
RegistrarMovimientoInventarioAction
GenerarDashboardComercialAction

La Action orquesta el caso de uso.

Service

Los Services contienen lógica de negocio compleja o reutilizable.

Ejemplos:

PedidoService
InventarioService
LeadService
ReporteComercialService
AnalyticsGatewayService

No crear Services vacíos si no tienen responsabilidad real.

Repository

Los Repositories encapsulan consultas reutilizables o complejas.

Se usan especialmente para:

Reportes.
Dashboards.
Filtros avanzados.
Consultas comerciales.
Consultas de inventario.
Métricas por canal.

No crear Repository si solo hará:

Model::find($id);
Model::create($data);

sin valor adicional.

Model

Los Models están en:

app/Models/

Pueden contener:

Relaciones Eloquent.
Casts.
Scopes simples.
Accessors simples.

No deben contener lógica pesada del negocio.

# 7. Comunicación entre dominios

Los dominios deben comunicarse de forma controlada.

Reglas:

Un dominio puede llamar directamente a otro solo si la acción es obligatoria para completar el caso de uso principal.
Las consecuencias secundarias deben comunicarse mediante Events y Listeners.
Evitar dependencias circulares.
Ningún Service debe convertirse en coordinador global del sistema.
Dashboard, Reportes y Analytics deben leer datos, pero no modificar procesos centrales como pedidos, pagos o inventario.

Ejemplo permitido:

ConfirmarPedidoAction → InventarioAvailabilityService

Ejemplo recomendado con evento:

PedidoConfirmado
→ DescontarStockListener
→ ActualizarDashboardComercialListener
→ RegistrarActividadEnBitacoraListener

Ejemplo a evitar:

PedidoService → InventarioService → PedidoService
# 8. Support vs Shared
Support

app/Support contiene utilidades técnicas genéricas.

Ejemplos:

CacheService
DateRange
MoneyFormatter
HttpClientFactory
SlugGenerator

Support no debe conocer conceptos del negocio como pedido, lead, pago o inventario.

Shared

app/Domains/Shared contiene elementos compartidos del negocio.

Ejemplos:

Contracts compartidos.
DTOs compartidos.
Events transversales.
Listeners transversales.
Enums generales del sistema.

Si algo pertenece claramente a un dominio, no debe ir en Shared.

# 9. Seguridad, roles y permisos

La seguridad se maneja en:

app/Domains/Seguridad/

El sistema usa Spatie Permission para:

Roles.
Permisos.
Asignación de roles a usuarios.
Asignación de permisos a roles.
Control de acceso por módulo.

No crear un sistema de roles manual.

El modelo User se mantiene en:

app/Models/User.php

Debe usar:

use Spatie\Permission\Traits\HasRoles;

Y dentro de la clase:

use HasRoles;
# 10. Roles iniciales

Los roles iniciales son:

Administrador

Tiene control total del sistema. Gestiona usuarios, roles, permisos, configuración general, CRM, inventario, pedidos, pagos, reportes y dashboards.

Supervisor Comercial

Supervisa la operación comercial general. Puede revisar leads, clientes, ventas, pedidos, pagos y rendimiento por canal.

Vendedor

Registra y gestiona leads, clientes y pedidos provenientes de canales como TikTok LIVE, WhatsApp, Instagram, Facebook o Telegram.

Encargado de Inventario

Administra productos, stock, movimientos de inventario, entradas, salidas, ajustes y alertas de bajo stock.

Encargado de Pedidos

Gestiona el flujo operativo de pedidos. Puede revisar pedidos confirmados, preparar entregas y actualizar estados.

Analista

Consulta reportes, métricas, dashboards comerciales y resultados analíticos. No opera ventas directamente.

# 11. Permisos iniciales

Permisos base:

clientes.ver
clientes.crear
clientes.editar
clientes.eliminar

leads.ver
leads.crear
leads.editar
leads.convertir
leads.eliminar

productos.ver
productos.crear
productos.editar
productos.eliminar

inventario.ver
inventario.ajustar
inventario.movimientos

pedidos.ver
pedidos.crear
pedidos.editar
pedidos.confirmar
pedidos.cancelar

pagos.ver
pagos.registrar
pagos.confirmar
pagos.rechazar

reportes.ver
dashboard.ver

usuarios.ver
usuarios.crear
usuarios.editar
usuarios.eliminar

roles.ver
roles.crear
roles.editar
roles.asignar
# 12. Asignación inicial sugerida de permisos
Administrador

Tiene todos los permisos.

Supervisor Comercial
clientes.ver
clientes.crear
clientes.editar

leads.ver
leads.crear
leads.editar
leads.convertir

pedidos.ver
pedidos.crear
pedidos.editar
pedidos.confirmar
pedidos.cancelar

pagos.ver
pagos.registrar
pagos.confirmar
pagos.rechazar

reportes.ver
dashboard.ver
Vendedor
clientes.ver
clientes.crear
clientes.editar

leads.ver
leads.crear
leads.editar
leads.convertir

pedidos.ver
pedidos.crear

pagos.ver
Encargado de Inventario
productos.ver
productos.crear
productos.editar

inventario.ver
inventario.ajustar
inventario.movimientos

dashboard.ver
Encargado de Pedidos
clientes.ver

pedidos.ver
pedidos.editar
pedidos.confirmar
pedidos.cancelar

pagos.ver

productos.ver
inventario.ver
dashboard.ver
Analista
clientes.ver
leads.ver
productos.ver
inventario.ver
pedidos.ver
pagos.ver
reportes.ver
dashboard.ver
# 13. Alcance multicanal de la primera versión

En la primera versión de AKINOMASS no se implementarán APIs externas de TikTok, WhatsApp, Instagram, Facebook, Telegram ni Marketplace.

El sistema no debe conectarse automáticamente a:

Chats externos.
Webhooks.
Bots.
Bandejas de entrada.
Comentarios en vivo.
APIs de mensajería.
APIs de redes sociales.
APIs de marketplaces.

La gestión multicanal será manual y estructurada desde la interfaz.

El sistema debe permitir registrar:

Canal de origen.
Tipo de flujo comercial.
Observaciones de la interacción.
Responsable comercial.
Estado del lead.
Estado del pedido.
Conversión de lead a cliente.
Conversión de lead o cliente a pedido.

No crear servicios como:

WhatsAppApiService
InstagramApiService
FacebookApiService
TikTokApiService
TelegramBotService
MarketplaceWebhookService
# 14. Canal de origen vs tipo de flujo comercial

AKINOMASS debe diferenciar entre canal de origen y tipo de flujo comercial.

Canal de origen

El canal de origen indica de dónde viene la interacción, lead o venta.

Canales iniciales:

TikTok LIVE
WhatsApp
Instagram
Facebook
Telegram
Marketplace
Web
Venta directa
Otro
Tipo de flujo comercial

El tipo de flujo indica cómo ocurre la dinámica comercial.

Tipos de flujo iniciales:

venta_en_vivo
conversacion_directa
marketplace
campania_marketing
referido
venta_directa
otro

No mezclar canal con flujo.

Ejemplos:

Canal: TikTok LIVE
Flujo: venta_en_vivo
Canal: WhatsApp
Flujo: conversacion_directa
Canal: Facebook
Flujo: marketplace
# 15. Ventas en vivo

AKINOMASS debe contemplar una estructura para ventas en vivo, orientada inicialmente a TikTok LIVE.

No se debe integrar API de TikTok.

El sistema debe permitir registrar manualmente:

Sesión de venta en vivo.
Productos ofrecidos durante la sesión.
Alias, nombre o referencia del interesado.
Interacción observada.
Producto de interés.
Intención de compra.
Conversión a lead.
Conversión a pedido.
Resumen de la sesión.

Las ventas en vivo tienen una dinámica rápida y en tiempo real, distinta a WhatsApp, Marketplace o conversaciones directas.

La estructura preparada es:

app/Domains/Comercial/LiveSales/

Reglas:

No integrar API de TikTok.
No leer comentarios automáticamente.
No crear bots.
No crear webhooks externos.
Priorizar velocidad de registro manual.
Mantener relación con canales, leads, pedidos y productos.
# 16. Plantillas de mensajes

AKINOMASS debe permitir plantillas de mensajes predeterminadas para apoyar a usuarios con poca experiencia en redes sociales.

Las plantillas solo deben funcionar como texto sugerido para copiar, pegar o adaptar.

No deben enviarse automáticamente en la primera versión.

No implementar:

Bots.
Webhooks.
APIs externas de mensajería.
Envíos automáticos.

Tipos sugeridos de plantillas:

primer_contacto
seguimiento
confirmacion_interes
confirmacion_pedido
recordatorio_pago
agradecimiento
cliente_inactivo
stock_disponible
respuesta_rapida_live

La estructura preparada es:

app/Domains/CRM/Plantillas/

El sistema debe permitir activar o desactivar el uso de plantillas para usuarios o negocios que ya tengan experiencia en redes, bots externos o procesos propios.

# 17. Redis

Redis ya está configurado para:

Cache.
Sesiones.
Colas.
Jobs.
Dashboards comerciales.
Reportes frecuentes.

Usos recomendados:

Cache de dashboard comercial.
Cache de métricas de ventas.
Cache de productos con bajo stock.
Cache de reportes frecuentes.
Procesamiento de Jobs.
Actualización diferida de métricas.

No realizar consultas pesadas en tiempo real para dashboards si pueden cachearse.

# 18. Jobs recomendados

Jobs sugeridos:

ActualizarDashboardComercialJob
GenerarReporteVentasJob
VerificarStockBajoJob
RecalcularConversionCanalesJob
ExportarReporteVentasJob
PrepararDatosAnaliticaJob
EnviarDatosVentasAFastAPIJob
ProcesarPrediccionDemandaJob
ActualizarMetricasAnaliticasJob

No crear Jobs innecesarios si la operación es simple e inmediata.

# 19. Events recomendados

Eventos sugeridos:

LeadRegistrado
LeadConvertidoEnCliente
ClienteCreado
PedidoCreado
PedidoConfirmado
PedidoCancelado
PagoRegistrado
PagoConfirmado
StockActualizado
StockBajoDetectado
ReporteSolicitado
SesionLiveCreada
InteraccionLiveRegistrada
# 20. Listeners recomendados

Listeners sugeridos:

RegistrarActividadEnBitacora
ActualizarDashboardComercial
VerificarStockDisponible
RecalcularMetricasCliente
VerificarStockBajo
RegistrarMovimientoInventario
ActualizarEstadoLead
ActualizarMetricasCanal

Ubicación de Listeners:

Si la acción pertenece a un dominio específico, el Listener va dentro de ese dominio.
Si la acción es transversal, el Listener va en app/Domains/Shared/Listeners.
# 21. FastAPI futuro

FastAPI no debe implementarse todavía.

AKINOMASS queda preparado para una futura integración con FastAPI como servicio analítico paralelo.

Laravel será el núcleo transaccional.

FastAPI será un servicio especializado en:

Predicción de demanda.
Segmentación de clientes.
Clasificación de leads.
Análisis de ventas.
Modelos con Python.
Pandas y Scikit-learn.

Reglas:

FastAPI no reemplaza la lógica principal de Laravel.
FastAPI no debe tocar directamente la base principal en la primera etapa.
Laravel preparará datos, llamará a FastAPI y guardará resultados.
No crear servidor FastAPI todavía.
No crear carpetas Python dentro del proyecto Laravel sin instrucción explícita.

Flujo futuro:

Laravel
→ Job Redis
→ Analytics Client
→ FastAPI
→ Resultado
→ Laravel
→ PostgreSQL

Estructura preparada:

app/Domains/Analytics/
├── Clients/
├── Services/
├── DTOs/
├── Jobs/
└── Contracts/
# 22. Frontend

El frontend usa:

React
Inertia.js
Tailwind CSS
Vite
Breeze React

Reglas:

No colocar lógica crítica de negocio en React.
No duplicar validaciones importantes solo en frontend.
La seguridad real debe estar en backend.
El frontend puede manejar diseño, componentes, formularios y visualización.
Los estados deben provenir del backend.
Los permisos deben validarse en backend.
No hardcodear permisos como única defensa.
No crear consumo de APIs externas de redes sociales.

El equipo frontend puede trabajar:

Colores.
Tipografías.
Espaciados.
Imágenes.
Animaciones.
Cards.
Tablas.
Formularios.
Componentes visuales.

Pero no debe cambiar:

Actions.
Services.
Repositories.
Models.
Migrations.
Jobs.
Events.
Listeners.
Arquitectura backend.
# 23. Módulos principales esperados

Módulos principales del sistema:

Seguridad.
Usuarios.
Roles.
Permisos.
Clientes.
Leads.
Plantillas.
Canales.
LiveSales.
Productos.
Categorías.
Inventario.
Pedidos.
Pagos.
Reportes.
Dashboard.
Analytics futuro.
# 24. Primera tarea recomendada para Codex

La primera tarea recomendada es:

Implementar RolesAndPermissionsSeeder usando Spatie Permission según README_CODEX.md.

Debe crear o actualizar:

database/seeders/RolesAndPermissionsSeeder.php
database/seeders/DatabaseSeeder.php

Debe usar Spatie Permission.

No debe crear sistema manual de roles.

Debe poder ejecutarse con:

php artisan db:seed --class=RolesAndPermissionsSeeder

Y debe poder verificarse con Tinker o base de datos.

# 25. Verificaciones obligatorias después de cambios

Después de cualquier cambio importante ejecutar:

php artisan config:clear
php artisan migrate:status
npm run build

Si se crean migraciones nuevas:

php artisan migrate

Si se agregan seeders:

php artisan db:seed --class=NombreDelSeeder
# 26. Qué no se debe hacer

No hacer:

No implementar APIs externas de redes sociales.
No implementar bots.
No implementar webhooks de WhatsApp, TikTok, Instagram, Facebook, Telegram o Marketplace.
No crear microservicios todavía.
No mover modelos a dominios.
No mover controladores a dominios.
No poner lógica de negocio en controladores.
No duplicar lógica en frontend.
No crear roles manuales fuera de Spatie.
No crear lógica pesada en modelos.
No alterar configuración Redis sin autorización.
No cambiar el stack.
No crear estructura distinta a app/Domains.
No implementar FastAPI todavía.
No crear automatizaciones externas de mensajería.
No asumir que el sistema leerá chats externos automáticamente.

# 27. Objetivo de la primera versión

La primera versión de AKINOMASS debe priorizar:

- Registro manual ordenado.
- CRM.
- Leads.
- Clientes.
- Canales de origen.
- Flujo comercial.
- Ventas en vivo manuales.
- Plantillas de mensajes sugeridas.
- Productos.
- Inventario.
- Pedidos.
- Pagos.
- Reportes.
- Dashboards.
- Roles y permisos.
- Base preparada para analítica futura.

La primera versión no debe priorizar:

- APIs externas.
- Bots.
- Automatización completa.
- FastAPI implementado.
- Machine learning real.
- Integraciones complejas.

---

# 28. Alcance funcional inicial

El alcance inicial de AKINOMASS debe enfocarse en construir una base funcional sólida, ordenada y mantenible.

Módulos funcionales iniciales:

- Seguridad.
- Usuarios.
- Roles.
- Permisos.
- Clientes.
- Leads.
- Canales de venta.
- Tipos de flujo comercial.
- Plantillas de mensajes.
- Ventas en vivo manuales.
- Productos.
- Categorías.
- Inventario.
- Pedidos.
- Pagos.
- Dashboard comercial.
- Reportes básicos.

No implementar funcionalidades avanzadas sin una instrucción explícita.

---

# 29. Alcance funcional futuro

Las siguientes funcionalidades quedan como preparación futura, no como implementación obligatoria inicial:

- Integración con FastAPI.
- Predicción de demanda.
- Segmentación automática de clientes.
- Clasificación predictiva de leads.
- Integración con APIs externas.
- Bots de mensajería.
- Automatización de respuestas.
- Lectura automática de chats externos.
- Sincronización automática con marketplaces.
- Machine learning real.
- Exportaciones avanzadas.
- Paneles analíticos predictivos.

Si se crean estructuras para estas funcionalidades, deben quedar vacías o mínimas, sin implementar lógica real todavía.

---

# 30. Regla sobre canales externos

Los canales externos deben manejarse solo como datos de origen comercial.

Ejemplos:

- TikTok LIVE.
- WhatsApp.
- Instagram.
- Facebook.
- Telegram.
- Marketplace.
- Web.
- Venta directa.
- Otro.

El sistema debe permitir seleccionar y guardar el canal, pero no debe conectarse automáticamente a ese canal.

No crear:

- Clientes HTTP para APIs sociales.
- Tokens de redes sociales.
- Webhooks de mensajería.
- Bots.
- Servicios de escucha de chats.
- Procesos automáticos de lectura de comentarios.

---

# 31. Regla sobre ventas en vivo

Las ventas en vivo deben manejarse como un flujo comercial manual y rápido.

La lógica debe permitir:

- Crear una sesión live.
- Asociar productos ofrecidos.
- Registrar interacciones manuales.
- Registrar alias o referencia del interesado.
- Marcar intención de compra.
- Convertir interacción en lead.
- Convertir lead en pedido.
- Generar resumen de la sesión.

No implementar:

- Lectura automática de comentarios.
- Integración con TikTok API.
- Integración con TikTok Shop.
- Bots para capturar interesados.
- Automatización externa.

---

# 32. Regla sobre plantillas de mensajes

Las plantillas de mensajes deben ser internas al sistema.

Deben funcionar como ayuda para el usuario, no como automatización.

El sistema puede permitir:

- Crear plantilla.
- Editar plantilla.
- Activar o desactivar plantilla.
- Clasificar plantilla por tipo.
- Sugerir plantilla según contexto.
- Copiar texto sugerido.
- Adaptar texto antes de usarlo.

No implementar:

- Envío automático.
- Conexión con WhatsApp.
- Conexión con Telegram.
- Conexión con Instagram.
- Conexión con Facebook.
- Bots.
- Webhooks.

---

# 33. Regla sobre dashboards

Los dashboards deben mostrar información resumida y útil para la toma de decisiones.

Ejemplos:

- Ventas del día.
- Ventas del mes.
- Pedidos pendientes.
- Pagos pendientes.
- Leads nuevos.
- Leads convertidos.
- Productos con bajo stock.
- Productos más vendidos.
- Ventas por canal.
- Conversión por canal.
- Ventas por tipo de flujo comercial.

Reglas:

- No hacer consultas pesadas directamente desde la vista.
- Usar Services y Repositories.
- Usar Redis para cache cuando corresponda.
- Usar Jobs si el cálculo es pesado.
- Dashboard no debe modificar datos centrales.

---

# 34. Regla sobre reportes

Los reportes deben ser principalmente operaciones de lectura.

Ejemplos de reportes:

- Reporte de ventas por fecha.
- Reporte de ventas por canal.
- Reporte de ventas por flujo comercial.
- Reporte de leads por estado.
- Reporte de conversión de leads.
- Reporte de pedidos por estado.
- Reporte de pagos por estado.
- Reporte de productos más vendidos.
- Reporte de stock bajo.
- Reporte de movimientos de inventario.

Reglas:

- Reportes no debe modificar pedidos, pagos, leads, clientes ni inventario.
- Las consultas complejas deben ir en Repositories.
- Los cálculos reutilizables deben ir en Services.
- Los reportes pesados deben ejecutarse mediante Jobs.
- Los resultados frecuentes pueden cachearse con Redis.

---

# 35. Regla sobre inventario

El inventario no debe manejarse solo como un número simple en productos.

Toda modificación de stock debe estar respaldada por un movimiento de inventario.

Tipos de movimiento sugeridos:

- entrada.
- salida.
- ajuste.
- devolucion.
- reserva.
- cancelacion.

Reglas:

- No cambiar stock directamente desde un Controller.
- No cambiar stock directamente desde una vista.
- No descontar stock sin registrar movimiento.
- No registrar pedido confirmado sin validar disponibilidad si corresponde.
- Los movimientos deben permitir trazabilidad.

---

# 36. Regla sobre pedidos

Los pedidos deben manejarse con estados claros.

Estados sugeridos:

- borrador.
- confirmado.
- preparando.
- enviado.
- entregado.
- cancelado.
- devuelto.

Reglas:

- Usar Enum para los estados.
- No usar strings mágicos.
- La creación de pedido debe ser una Action.
- La confirmación de pedido debe ser una Action.
- La cancelación de pedido debe ser una Action.
- Los cambios importantes deben emitir Events.
- No mezclar lógica de pagos, inventario y reportes directamente en el Controller.

---

# 37. Regla sobre pagos

Los pagos deben estar separados de los pedidos.

Estados sugeridos:

- pendiente.
- pagado.
- observado.
- rechazado.
- reembolsado.

Métodos sugeridos:

- QR.
- transferencia.
- efectivo.
- deposito.
- otro.

Reglas:

- Usar Enum para estados de pago.
- Usar Enum o catálogo para métodos de pago.
- Registrar pago no siempre significa confirmar pedido.
- Confirmar pago debe ser una Action.
- Los eventos de pago pueden actualizar pedidos, dashboard o métricas mediante Listeners.

---

# 38. Regla sobre leads

Los leads representan interesados o posibles clientes.

Estados sugeridos:

- nuevo.
- contactado.
- interesado.
- pendiente_pago.
- convertido.
- perdido.
- descartado.

Reglas:

- Usar Enum para estados de lead.
- Un lead debe tener canal de origen.
- Un lead debe tener tipo de flujo comercial.
- Un lead puede convertirse en cliente.
- Un lead puede generar pedido.
- La conversión debe ser una Action.
- No eliminar leads importantes sin considerar trazabilidad.

---

# 39. Regla sobre clientes

Los clientes representan personas o entidades con relación comercial más estable.

El cliente puede venir desde:

- Lead convertido.
- Registro manual.
- Pedido directo.
- Venta directa.

Reglas:

- No duplicar clientes si ya existe una coincidencia clara.
- Mantener historial básico de interacción cuando corresponda.
- Asociar clientes con pedidos.
- Asociar clientes con canal inicial si aplica.
- No colocar lógica compleja de CRM en el modelo Cliente.

---

# 40. Regla sobre productos y catálogo

El catálogo define qué productos existen.

El inventario define cuántas unidades hay disponibles.

Reglas:

- No mezclar catálogo con stock.
- Producto debe tener información comercial.
- Inventario debe manejar disponibilidad.
- Los productos pueden tener categorías.
- Los productos pueden aparecer en pedidos.
- Los productos pueden participar en sesiones live.

---

# 41. Regla sobre seeders

Los seeders deben usarse para datos iniciales del sistema.

Seeders esperados:

- RolesAndPermissionsSeeder.
- CanalesVentaSeeder.
- TiposFlujoComercialSeeder.
- Estados iniciales si se manejan como catálogos.
- UsuarioAdministradorSeeder si se solicita explícitamente.

Reglas:

- No crear datos de prueba excesivos en seeders de producción.
- Separar seeders de configuración y seeders de demo.
- No crear usuarios reales con contraseñas inseguras en código final.
- Si se crea usuario administrador inicial, debe estar claramente marcado como temporal o configurable.

---

# 42. Regla sobre migraciones

Las migraciones deben ser claras, reversibles y coherentes.

Reglas:

- Usar nombres de tablas en español si se mantiene la convención del proyecto.
- Evitar columnas ambiguas.
- Definir foreign keys cuando corresponda.
- Usar índices para campos consultados frecuentemente.
- No modificar migraciones ya ejecutadas si existe riesgo de afectar a otros; crear nueva migración.
- Mantener consistencia con PostgreSQL.

---

# 43. Regla sobre nombres

Usar nombres claros y consistentes.

Clases sugeridas:

- CrearPedidoAction.
- ConfirmarPedidoAction.
- RegistrarPagoAction.
- ConfirmarPagoAction.
- RegistrarLeadAction.
- ConvertirLeadEnClienteAction.
- RegistrarMovimientoInventarioAction.
- GenerarDashboardComercialAction.

Evitar nombres genéricos como:

- Manager.
- Helper.
- Processor.
- Handler.
- Logic.
- Utils.

Solo usar nombres genéricos si tienen propósito técnico real y están en Support.

---

# 44. Regla sobre pruebas

Si se crean funcionalidades críticas, deben considerarse pruebas.

Áreas importantes para test:

- Roles y permisos.
- Creación de pedidos.
- Confirmación de pedidos.
- Registro de pagos.
- Conversión de leads.
- Movimientos de inventario.
- Acceso por rol.

No romper las pruebas generadas por Breeze.

---

# 45. Regla sobre documentación

Si se crea un módulo importante, actualizar documentación correspondiente.

Actualizar cuando aplique:

- README_CODEX.md.
- README_ARQUITECTURA.md.
- README_REGLAS_BACKEND.md.
- README_FASTAPI_FUTURO.md.
- README del dominio correspondiente.

No eliminar documentación existente sin reemplazo justificado.

---

# 46. Regla sobre commits sugeridos

Los cambios deben organizarse en commits claros.

Ejemplos:

- Crea seeder de roles y permisos.
- Implementa base de canales de venta.
- Implementa estructura de leads.
- Implementa catálogo de productos.
- Implementa movimientos de inventario.
- Implementa flujo base de pedidos.
- Implementa registro de pagos.
- Agrega dashboard comercial base.

Evitar commits genéricos como:

- cambios.
- update.
- varios.
- fix.
- prueba.

---

# 47. Orden recomendado de implementación

El orden recomendado para implementar el sistema es:

1. Roles y permisos.
2. Canales de venta.
3. Tipos de flujo comercial.
4. Clientes.
5. Leads.
6. Plantillas de mensajes.
7. Productos y categorías.
8. Inventario base.
9. Pedidos.
10. Pagos.
11. Ventas en vivo manuales.
12. Dashboard comercial.
13. Reportes básicos.
14. Preparación de Analytics.
15. Mejoras visuales.

No implementar Analytics predictivo antes de tener datos reales.

---

# 48. Criterio de aceptación general

Una tarea se considera aceptada si:

- Respeta la arquitectura.
- No rompe `npm run build`.
- No rompe migraciones.
- No introduce APIs externas no solicitadas.
- No mueve modelos fuera de `app/Models`.
- No pone lógica de negocio en controladores.
- Usa Spatie para roles y permisos.
- Usa Enums para estados cuando corresponda.
- Usa Actions para casos de uso relevantes.
- Usa Jobs si el proceso es pesado.
- Mantiene documentación coherente.

---

# 49. Comandos de verificación final

Antes de cerrar cualquier tarea importante, ejecutar:

```bash
php artisan config:clear
php artisan migrate:status
npm run build

Si se agregaron migraciones:

php artisan migrate

Si se agregaron seeders:

php artisan db:seed

Si se necesita verificar rutas:

php artisan route:list

Si se necesita verificar paquetes instalados:

composer show

Si se necesita verificar el estado del repositorio:

git status
# 50. Principio final

AKINOMASS debe crecer de forma ordenada.

La prioridad no es crear muchas funcionalidades rápido, sino construir una base comercial sólida, defendible y mantenible.

Toda implementación debe respetar:

Simplicidad.
Separación de responsabilidades.
Trazabilidad comercial.
Registro manual estructurado.
Preparación futura para automatización.
No dependencia temprana de APIs externas.
Arquitectura modular por dominios.
Uso correcto de Laravel, Inertia, React, PostgreSQL y Redis.
Uso de Spatie Permission para roles y permisos.
Comunicación controlada entre dominios.
Documentación clara para el equipo.
# 51. Resumen operativo para Codex

Antes de implementar cualquier funcionalidad, Codex debe revisar:

README_CODEX.md
README_ARQUITECTURA.md
README_REGLAS_BACKEND.md
README_REGLAS_FRONTEND.md
README_FASTAPI_FUTURO.md
README del dominio correspondiente en app/Domains

Codex no debe asumir funcionalidades no documentadas.

Si una funcionalidad no está definida, debe seguir la arquitectura existente y mantener el alcance inicial:

Manual.
Modular.
Sin APIs externas.
Sin bots.
Sin FastAPI implementado todavía.
Sin lógica de negocio en controladores.
# 52. Instrucción final para implementación

Cuando se solicite una tarea, Codex debe implementar solo lo pedido.

Ejemplo correcto:

Implementar RolesAndPermissionsSeeder usando Spatie Permission.

Codex debe limitarse a:

Crear el seeder.
Registrar el seeder si corresponde.
Usar Spatie Permission.
Respetar los roles y permisos definidos.
No crear módulos adicionales.
No modificar frontend si no es necesario.
No crear APIs externas.
No modificar arquitectura.

Ejemplo incorrecto:

Implementar todo el sistema AKINOMASS completo.

Ese tipo de implementación no debe realizarse porque aumenta el riesgo de código desordenado, duplicado o fuera de alcance.

# 53. Estado esperado del proyecto base

El proyecto base debe mantenerse en un estado donde:

El build frontend funcione.
Las migraciones existentes estén ejecutadas.
La autenticación Breeze funcione.
Spatie Permission esté instalado.
Redis esté disponible para cache, sesiones y colas.
La estructura app/Domains esté presente.
app/Support contenga utilidades técnicas.
app/Domains/Shared contenga elementos comunes del negocio.
No existan integraciones externas no solicitadas.
No exista lógica de negocio en controladores generados.
# 54. Cierre

Este documento tiene prioridad para orientar a Codex en la implementación del sistema AKINOMASS.

Cualquier generación de código debe respetar estas reglas.

El sistema debe ser construido como:

MVC Laravel
+
Monolito modular
+
Arquitectura por capas
+
Dominios funcionales
+
Redis para infraestructura
+
Spatie Permission para seguridad
+
Inertia React para frontend
+
FastAPI preparado para futuro

La primera versión debe ser funcional, ordenada y defendible académicamente, sin sobrecargar el sistema con integraciones externas prematuras.
`````
