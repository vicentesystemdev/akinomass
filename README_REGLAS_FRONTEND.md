# Reglas Frontend AKINOMASS

El frontend utiliza:

- Inertia.js
- React
- Tailwind CSS
- Vite
- Breeze React como base inicial

## Ubicación

resources/js/

## Estructura recomendada futura

resources/js/
├── Components/
├── Layouts/
├── Pages/
└── Services/

## Reglas

- El frontend no debe contener lógica de negocio crítica.
- Los cálculos comerciales importantes deben estar en backend.
- Las páginas React deben consumir datos enviados desde controladores Inertia.
- Los componentes visuales pueden modificar diseño, colores, espacios, animaciones e imágenes.
- No modificar Actions, Services, Repositories, Models, Migrations ni Jobs desde trabajo frontend.
- No duplicar reglas de estados en frontend. Los estados deben venir desde backend.
- No hardcodear permisos en frontend como única seguridad. La seguridad real debe estar en backend.

## Diseño

El equipo frontend puede trabajar:

- Paleta de colores a utilizar Azul y todos los derivados de ese grupo de color.
- Tipografía.
- Espaciado.
- Animaciones.
- Imágenes.
- Componentes visuales.
- Tablas.
- Cards.
- Formularios.

Pero no debe cambiar la arquitectura BACKEND.

## Interfaz multicanal

La interfaz debe permitir registrar manualmente el canal de origen de una interacción, lead, cliente o pedido.

Canales sugeridos:

- TikTok LIVE
- WhatsApp
- Instagram
- Facebook
- Telegram
- Marketplace
- Web
- Venta directa
- Otro

## Interfaz para tipo de flujo comercial

La interfaz debe permitir seleccionar el tipo de flujo comercial:

- Venta en vivo
- Conversación directa
- Marketplace
- Campaña de marketing
- Referido
- Venta directa
- Otro

## Interfaz para ventas en vivo

El módulo de ventas en vivo debe priorizar velocidad y simplicidad.

Debe permitir:

- Crear sesión live.
- Seleccionar productos ofrecidos.
- Registrar alias o interesado rápidamente.
- Registrar producto de interés.
- Marcar intención de compra.
- Convertir en lead o pedido.

## Interfaz para plantillas

Las plantillas deben mostrarse como textos sugeridos.

La interfaz puede permitir:

- Copiar mensaje.
- Editar mensaje sugerido.
- Filtrar plantilla por tipo.
- Asociar plantilla al estado del lead o pedido.

No debe mostrar funciones de envío automático si no existen APIs integradas.
