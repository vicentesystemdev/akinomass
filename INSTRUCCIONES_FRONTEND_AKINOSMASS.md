# 🛠️ Guía Maestra de Desarrollo Frontend y UX/UI: AKINOMASS

[cite_start]Este documento establece las directrices de diseño, reglas de arquitectura, flujos de Git y especificaciones técnicas obligatorias para la fase de frontend del sistema **AKINOMASS**[cite: 30]. [cite_start]Ningún miembro del equipo o asistente de IA debe desviarse de estas pautas para asegurar un producto limpio, profesional, responsivo y consistente[cite: 31, 32].

---

## 1. Identidad Visual y Filosofía de Diseño ("Modern Earth")

[cite_start]El sistema debe proyectar la estética visual de una **marca de ropa casual comercial y limpia** inspirada en conceptos como jeans, algodón, kakis y texturas naturales[cite: 5]. 

### 🎨 Paleta de Colores Oficial
[cite_start]Queda totalmente cerrada la paleta de colores[cite: 2]. [cite_start]Está prohibido introducir tonos ajenos a esta lista[cite: 9]:

| Elemento Visual | Rol / Identidad | Código Hex | Aplicación en Interfaz |
| :--- | :--- | :--- | :--- |
| **Primario** | Verde oliva oscuro | `#3C473A` | [cite_start]Sidebar general y encabezados principales[cite: 3, 8]. |
| **Acción Principal** | Terracota / Naranja quemado | `#D77A61` | [cite_start]Botones primarios, elementos activos e interacción[cite: 3, 8]. |
| **Fondo General** | Crema suave | `#FDF6F0` | [cite_start]Fondo de la aplicación detrás de los módulos[cite: 3, 8]. |
| **Texto Principal** | Marrón café muy oscuro | `#2B221E` | [cite_start]Tipografía general, títulos y textos de lectura[cite: 3, 8]. |

### 🟢 Semántica de Estados Universales
[cite_start]Para evitar que cada desarrollador pinte los estados de forma distinta, se implementa la siguiente regla estricta de color por estado[cite: 20]:
* [cite_start]**Verde:** Activo, pagado, confirmado, entregado, completado[cite: 19].
* [cite_start]**Terracota / Naranja:** Acción principal, pendiente, en preparación, observado, en vivo[cite: 19, 165].
* [cite_start]**Azul suave:** Enviado, en proceso, informativo[cite: 19].
* [cite_start]**Rojo:** Cancelado, rechazado, agotado, error, obligatorio[cite: 19].
* [cite_start]**Gris:** Borrador, inactivo, neutral[cite: 19].

---

## 2. Layout Obligatorio y UX/UI Potenciada

[cite_start]Todos los módulos del sistema deben respetar un layout único y consistente[cite: 7]. [cite_start]**No se permite diseñar estructuras diferentes por módulo**[cite: 9].

### 📐 Reglas de Estructura Visual
* [cite_start]**Sidebar Izquierdo:** Color verde oliva oscuro (`#3C473A`) fijo con el logotipo corporativo[cite: 8]. [cite_start]Los menús activos deben destacarse en terracota (`#D77A61`)[cite: 8].
* [cite_start]**Fondo de Aplicación:** Crema suave (`#FDF6F0`) en todas las pantallas de fondo[cite: 8].
* [cite_start]**Contenedores (Cards):** Color blanco o crema muy claro, bordes redondeados (`rounded-xl`) y sombras sutiles para generar una separación limpia[cite: 8].
* [cite_start]**Tablas:** Diseños limpios, con encabezados visiblemente contrastados y bordes sutiles[cite: 8].
* [cite_start]**Botones:** Los principales lucirán en terracota con texto claro; los secundarios serán neutros/claros[cite: 8, 132].

### ⚡ Optimizaciones de UX/UI Añadidas
1. **Transiciones Estándar:** Todos los elementos interactivos (botones, enlaces del menú, inputs) deben contar con la clase Tailwind `transition-all duration-200 ease-in-out` para evitar saltos visuales bruscos.
2. **Estados de Feedback (:hover y :focus):** Los botones terracota deben oscurecerse sutilmente al pasar el cursor (`hover:bg-[#c56950]`) y mostrar un anillo de accesibilidad claro al enfocarse (`focus:ring-2 focus:ring-[#D77A61]`).
3. **Control de Carga (Loading States):** Al procesar un formulario a través de Inertia, los botones de envío deben cambiar su estado a `disabled`, reducir su opacidad y mostrar un indicador visual de "Procesando..." para evitar clics duplicados.
4. **Manejo Obligatorio de Estados Vacíos:** Cuando una tabla o listado devuelva cero registros, está prohibido dejar la pantalla en blanco. [cite_start]Es obligatorio renderizar el componente `EmptyState.jsx` incorporando un texto de ayuda claro[cite: 32].

---

## 3. Arquitectura de Archivos y Restricciones de Control

> [cite_start]⚠️ **REGLA DE ORO:** El backend está completamente congelado[cite: 30]. [cite_start]No se deben tocar bases de datos, permisos ni reglas lógicas del negocio desde el servidor[cite: 31].

### [cite_start]📂 Lo que SÍ se puede modificar[cite: 23]:
* [cite_start]`resources/js/Pages/*` [cite: 24]
* [cite_start]`resources/js/Layouts/*` [cite: 24]
* [cite_start]`resources/js/Components/*` [cite: 24]
* [cite_start]`resources/css/app.css` [cite: 24]
* [cite_start]`tailwind.config.js` *(únicamente para mapear o extender los colores oficiales de la paleta)*[cite: 24].

### [cite_start]🚫 Lo que NO se puede modificar sin autorización explícita[cite: 25]:
* [cite_start]`database/migrations` y `database/seeders` [cite: 26]
* [cite_start]`app/Models`, `app/Domains`, `app/Http/Controllers`, y `app/Http/Requests` [cite: 26]
* [cite_start]`routes/web.php` [cite: 26]
* [cite_start]`.env`, `composer.json`, y `package.json` [cite: 26]

### 🛡️ Validación de Datos y Errores en Frontend
* **Validación Reactiva:** Antes de enviar el formulario por Inertia, evalúa estados simples en JS para mitigar cargas innecesarias en el servidor.
* **Manejo Visual de Errores del Servidor:** Al recibir los `errors` que inyecta Inertia, resalta el borde del input afectado en rojo semántico (`border-red-500`) y despliega el mensaje de error inmediatamente debajo.
* **Preservación del Scroll:** En actualizaciones de estado en listas o formularios extensos, utiliza las directivas de Inertia `preserveScroll: true` y `preserveState: true` para no romper la experiencia de navegación del usuario.

---

## 4. Ecosistema de Componentes Comunes de UI

[cite_start]Para garantizar que todos utilicen exactamente los mismos bloques de construcción visual, se establece la creación y el uso mandatorio de componentes comunes en la ruta `resources/js/Components/UI/`[cite: 11, 12]:

```
resources/js/Components/UI/
├── PageHeader.jsx            # Título modular, breadcrumbs y acciones principales de la vista.
├── SectionCard.jsx           # Contenedor base tipo tarjeta con bordes redondeados y sombra.
├── StatusBadge.jsx           # Etiqueta de estados (Badge) configurada con los colores semánticos.
├── EmptyState.jsx            # Layout alternativo elegante para vistas o tablas sin registros.
├── PrimaryActionButton.jsx   # Botón de interacción principal en color terracota.
├── SecondaryButton.jsx       # Botón secundario para cancelaciones o flujos alternos.
├── TableWrapper.jsx          # Envoltorio para tablas limpias con scroll horizontal responsivo.
└── FormCard.jsx              # Tarjeta optimizada con espaciados estándar para formularios.
```
[cite_start]*(Todos los componentes listados son mínimos obligatorios [cite: 14]).*

### 🚫 Restricción de Paquetes y Frameworks Terceros
[cite_start]El proyecto ya incluye un ecosistema moderno y balanceado: **Laravel 13, Inertia React, Tailwind CSS, Vite, PostgreSQL, Redis y Spatie Permission**[cite: 58].
* [cite_start]No se permite instalar Bootstrap, Material UI, Ant Design, DaisyUI o shadcn/ui[cite: 59, 97].
* [cite_start]Si se requieren iconos, se debe inspeccionar primero si la librería base instalada los cubre[cite: 99]. [cite_start]De lo contrario, se deben implementar **estructuras SVG puras y limpias**[cite: 100].

---

## 5. Estrategia de Trabajo, Git y Coordinación

### 📦 Flujo de Integración Secuencial
[cite_start]Para evitar conflictos de fusión (`merge conflicts`) destructivos en el layout principal, el desarrollo se segmentará de forma estrictamente ordenada[cite: 47, 48]:

1. [cite_start]**Paso 1:** Construcción unificada de la **Base Visual Común** (Layout general, Sidebar, Topbar, Tailwind config)[cite: 50, 114]. [cite_start]Una vez aprobado, se integra a `develop`[cite: 121].
2. [cite_start]**Paso 2:** Carla (Módulo CRM y Plantillas)[cite: 53].
3. [cite_start]**Paso 3:** Victor (Módulo Catálogo e Inventario)[cite: 53].
4. [cite_start]**Paso 4:** Marcelo (Módulo Comercial, Pagos, LiveSales y Reportes)[cite: 53].


## 6. Mensajes Oficiales y Contexto para el Equipo

### ✉️ Mensaje de Lanzamiento para enviar al canal del Equipo
> **Equipo**, ya pasamos a la fase de frontend/UX de AKINOMASS. [cite_start]El backend queda completamente congelado[cite: 30]. [cite_start]No se deben modificar bajo ninguna circunstancia migraciones, modelos, Actions, Services, Requests, seeders, permisos ni reglas de negocio[cite: 31].
> 
> [cite_start]La interfaz debe respetar al pie de la letra la paleta Modern Earth: Primario Verde Oliva (#3C473A), Acción Terracota (#D77A61), Fondo Crema (#FDF6F0) y Texto Café Oscuro (#2B221E)[cite: 31]. [cite_start]Buscamos una apariencia limpia, natural y profesional inspirada en marcas de ropa casual[cite: 31, 32]. 
> 
> [cite_start]**Recuerden:** Cada uno trabajará en su propia rama y es obligatorio ejecutar con éxito `npm run build` antes de realizar cualquier entrega[cite: 32]. ¡A darle con todo!

---

### 📋 Bloque de Contexto Maestro (Copiar y pegar obligatoriamente al iniciar un chat con IA)
```text
Estoy trabajando en el desarrollo frontend del sistema AKINOMASS. [cite_start]AKINOMASS es una plataforma comercial web multicanal diseñada para la gestión integral de clientes, leads, productos, existencias en inventario, pedidos, pasarelas de pago, LiveSales y analítica de reportes[cite: 76].

[cite_start]El Stack Tecnológico está compuesto por: Laravel 13, Inertia.js, React, Tailwind CSS, Vite, Spatie Permission, PostgreSQL y Redis[cite: 76].

RESTRICCIONES OPERATIVAS ABSOLUTAS:
- [cite_start]Esta es una tarea de FRONTEND / UX de manera EXCLUSIVA[cite: 76].
- [cite_start]NO puedes modificar, crear ni alterar: database/migrations, app/Models, app/Domains, app/Http/Controllers, app/Http/Requests, database/seeders, routes/web.php, .env, composer.json ni package.json[cite: 76].
- [cite_start]NO modifiques la lógica de negocio, bases de datos, APIs o reglas de permisos del backend[cite: 76].
- [cite_start]NO instales paquetes de diseño externos (No Bootstrap, shadcn/ui, Material UI, DaisyUI, etc.)[cite: 97].
- [cite_start]SÍ puedes modificar: carpetas dentro de resources/js/Pages, resources/js/Layouts, resources/js/Components, el archivo resources/css/app.css y tailwind.config.js (exclusivamente para añadir extensiones cromáticas)[cite: 76].

Paleta Cromática Oficial (Modern Earth):
- [cite_start]Primario / Identidad: Verde oliva oscuro #3C473A [cite: 76]
- [cite_start]Acción Principal: Terracota / Naranja quemado #D77A61 [cite: 76, 77]
- [cite_start]Fondo de la App: Crema suave #FDF6F0 [cite: 77]
- [cite_start]Texto General: Marrón café muy oscuro #2B221E [cite: 77]

[cite_start]Concepto de Diseño: Interfaz moderna, limpia, natural, comercial y sumamente pulida, emulando la estética de marcas de indumentaria casual de algodón y mezclilla[cite: 77, 78]. [cite_start]Todo debe estructurarse mediante tarjetas claras con esquinas redondeadas, tablas prolijas con cabeceras explícitas, uso coherente de badges semánticos, transiciones de interacción suaves y diseño responsivo adaptativo[cite: 78].

[cite_start]Antes de escribir código, preséntame detalladamente el plan de acción indicando qué archivos específicos planeas modificar[cite: 110]. [cite_start]Asegúrate de que el código generado sea totalmente limpio y compatible con 'npm run build'[cite: 78].
```

---

## 8. Prompts Técnicos de Ejecución por Módulo

### 🗂️ PROMPT 1 — BASE VISUAL COMÚN (Paso Inicial Obligatorio)
```text
[Insertar Bloque de Contexto Maestro]

[cite_start]Actúa como un Ingeniero Frontend experto en React, Inertia.js y Tailwind CSS[cite: 124]. [cite_start]Tu objetivo exclusivo en este prompt es dar vida y consolidar la arquitectura visual base del sistema AKINOMASS para que el resto de los desarrolladores cuenten con un entorno predecible y unificado[cite: 124].

[cite_start]Archivos específicos bajo tu alcance[cite: 124, 125]:
- resources/js/Layouts/AuthenticatedLayout.jsx
- resources/js/Components/UI/* (Creación de componentes comunes)
- resources/css/app.css
- tailwind.config.js (Inclusión de colores institucionales)
- resources/js/Pages/Dashboard.jsx (Modificación menor si requiere enlazar componentes globales)

Tareas a realizar:
1. Rediseñar por completo 'AuthenticatedLayout.jsx'[cite: 127]. Desmárcate de los componentes genéricos por defecto de Laravel Breeze[cite: 126, 133]. Construye un espacio de trabajo profesional de nivel empresarial[cite: 126].
2. Desarrollar un Sidebar lateral izquierdo robusto: Fondo verde oliva oscuro (#3C473A), cabecera con el logotipo estilizado de AKINOMASS[cite: 127, 128]. Menú de navegación completo con los módulos: Dashboard, Clientes, Leads, Plantillas, Categorías, Productos, Inventario, Movimientos, Pedidos, Pagos, LiveSales y Reportes[cite: 128]. El elemento activo del menú debe pintarse en color terracota (#D77A61)[cite: 128]. Integra el renderizado condicional de los ítems respetando los permisos de Spatie existentes sin alterar la seguridad del controlador[cite: 129].
3. Diseñar un Topbar superior limpio y flotante: Incluye una barra de búsqueda simulada, visualización del perfil del usuario (nombre, correo y rol asignado) y un botón interactivo elegante para el cierre de sesión[cite: 130].
4. Programar los componentes reutilizables en 'resources/js/Components/UI/'[cite: 131]. Cada archivo debe exportarse de forma limpia y soportar propiedades dinámicas comunes (children, className, etc.)[cite: 131]:
   - PageHeader.jsx [cite: 131]
   - SectionCard.jsx [cite: 131]
   - StatusBadge.jsx [cite: 131]
   - EmptyState.jsx [cite: 131]
   - PrimaryActionButton.jsx [cite: 131]
   - SecondaryButton.jsx [cite: 131]
   - TableWrapper.jsx [cite: 131]
   - FormCard.jsx [cite: 131]
5. Asegurar un comportamiento responsive básico en toda la estructura del layout[cite: 132].
```

#### Archivos que debe leer el desarrollador / IA antes de iniciar[cite: 80]:
* [cite_start]`README_REGLAS_FRONTEND.md` [cite: 81]
* [cite_start]`resources/js/Layouts/AuthenticatedLayout.jsx` [cite: 81]
* [cite_start]`resources/js/Pages/Dashboard.jsx` [cite: 81]

---

### 👥 PROMPT 2 — CRM Y PLANTILLAS DE MENSAJES
```text
[Insertar Bloque de Contexto Maestro]

[cite_start]Tu misión técnica consiste en refactorizar y embellecer de forma exclusiva la capa visual y la experiencia de usuario (UX/UI) de los módulos pertenecientes a Clientes, Leads y Plantillas de Mensajes, consumiendo los componentes del layout común e implementando validaciones fluidas[cite: 136, 139].

[cite_start]Archivos asignados para su modificación[cite: 137, 139]:
- resources/js/Pages/Clientes/Index.jsx, Create.jsx, Edit.jsx
- resources/js/Pages/Leads/Index.jsx, Create.jsx, Edit.jsx, y Partials.jsx (si aplica)
- resources/js/Pages/PlantillasMensaje/Index.jsx, Create.jsx, Edit.jsx

Requerimientos específicos por pantalla:
1. Gestión de Clientes: Reemplazar listados crudos por estructuras estilizadas usando 'TableWrapper'. [cite_start]Diseñar el botón de "Crear Cliente" de forma visible y prioritaria[cite: 140]. [cite_start]Organizar los formularios de creación y edición en secciones limpias usando 'FormCard'[cite: 140]. Desplegar errores de validación de campo en tiempo real de forma elegante.
2. [cite_start]Gestión de Leads: Estructurar una visualización sumamente clara[cite: 141]. [cite_start]Implementar 'StatusBadge' para mapear rigurosamente los estados nativos: nuevo (verde), contactado (terracota), interesado (terracota), pendiente_pago (terracota), convertido (verde), perdido (rojo) y descartado (rojo)[cite: 141, 142]. [cite_start]Dar visibilidad de forma interactiva y prioritaria a las acciones críticas: "Editar Lead", "Cambiar Estado" y el botón principal para "Convertir a Cliente"[cite: 141]. [cite_start]Mostrar el canal de procedencia y flujos de forma legible[cite: 141].
3. [cite_start]Plantillas de Mensajes: Desarrollar una interfaz limpia pensada específicamente para que el operador lea, copie o adapte texto de forma manual y ágil[cite: 142]. [cite_start]Muestra los cuerpos de texto dentro de cards de lectura cómoda[cite: 142]. [cite_start]Incorpora badges para identificar si están activas (verde) o inactivas (gris), y badges informativos de tipo de plantilla[cite: 142]. [cite_start]Debe quedar explícito visualmente en la UI que el sistema NO dispara automatizaciones de mensajería (No WhatsApp/Telegram APIs, etc.) a fin de no generar falsas expectativas de integración en el operador[cite: 142, 143].
```

#### [cite_start]Archivos que debe leer el desarrollador / IA antes de iniciar[cite: 80]:
* [cite_start]`resources/js/Pages/Clientes/*` [cite: 84]
* [cite_start]`resources/js/Pages/Leads/*` [cite: 84]
* [cite_start]`resources/js/Pages/PlantillasMensaje/*` [cite: 84]

---

### 📦 PROMPT 3 — CATÁLOGO E INVENTARIO
```text
[Insertar Bloque de Contexto Maestro]

[cite_start]Tu misión técnica consiste en transformar el frontend de los módulos de Categorías, Productos, Inventario y Historial de Movimientos[cite: 146]. [cite_start]Debes priorizar la legibilidad comercial de los artículos y generar alertas de stock altamente visibles sin tocar las lógicas de almacenamiento del backend[cite: 149].

[cite_start]Archivos asignados para su modificación[cite: 147, 149]:
- resources/js/Pages/CategoriasProducto/Index.jsx, Create.jsx, Edit.jsx
- resources/js/Pages/Productos/Index.jsx, Create.jsx, Edit.jsx
- resources/js/Pages/Inventario/Index.jsx, Entrada.jsx, Salida.jsx, Ajustar.jsx, Movimientos.jsx

Requerimientos específicos por pantalla:
1. [cite_start]Categorías de Producto: Listados minimalistas, limpios y eficientes que utilicen badges de estado (activo en verde, inactivo en gris) y formularios de creación sumamente prolijos[cite: 150, 153, 154].
2. [cite_start]Catálogo de Productos: Diseñar una grilla comercial altamente visual o una tabla extendida donde se visualice de un vistazo el SKU, la categoría asignada, el precio base, y el estado comercial[cite: 151]. [cite_start]Mapear los badges del producto de forma precisa: activo (verde), inactivo (gris), agotado (rojo) o descontinuado (rojo)[cite: 151]. [cite_start]Los formularios de carga deben verse estructurados y limpios[cite: 151].
3. [cite_start]Control de Inventario: Desarrollar tarjetas informativas de rendimiento de existencias[cite: 152]. [cite_start]Es un requisito mandatorio resaltar de forma crítica con colores e iconos de advertencia terracota/naranja (#D77A61) aquellos ítems cuyo stock actual se encuentre por debajo del stock mínimo estipulado[cite: 152, 154]. [cite_start]Estructurar flujos de interacción sencillos para los formularios de Ajuste, Entrada y Salida de mercancía[cite: 152].
4. [cite_start]Historial de Movimientos de Inventario: Crear una tabla o componente de línea de tiempo ('Timeline') limpio y legible[cite: 153]. [cite_start]Utilizar colores semánticos para el tipo de movimiento de stock: entrada (verde), salida crítica (rojo), ajuste (terracota), devolución (verde), reserva (azul suave) y cancelación (rojo)[cite: 153, 154]. [cite_start]Exponer con total claridad los campos de stock anterior, stock nuevo y el usuario responsable si el backend provee dicho objeto de datos[cite: 153].
```

#### Archivos que debe leer el desarrollador / IA antes de iniciar[cite: 80]:
* `resources/js/Pages/CategoriasProducto/*` [cite: 86]
* `resources/js/Pages/Productos/*` [cite: 86]
* `resources/js/Pages/Inventario/*` [cite: 86]

---

### 📊 PROMPT 4 — COMERCIAL, PAGOS, LIVESALES Y REPORTES
```text
[Insertar Bloque de Contexto Maestro]

[cite_start]Tu misión técnica consiste en optimizar e impregnar un diseño de alta gama en las interfaces de Pedidos, Pagos, las simulaciones interactivas de LiveSales y las pantallas analíticas de Reportes[cite: 157, 160]. [cite_start]El foco principal es la claridad de datos económicos y la comodidad del usuario durante las demostraciones en vivo[cite: 160, 164].

[cite_start]Archivos asignados para su modificación[cite: 158, 160]:
- resources/js/Pages/Pedidos/Index.jsx, Create.jsx, Edit.jsx, Show.jsx
- resources/js/Pages/Pagos/Index.jsx, Create.jsx, Edit.jsx, Show.jsx
- resources/js/Pages/LiveSales/Index.jsx, Create.jsx, Edit.jsx, Show.jsx, Interacciones.jsx
- resources/js/Pages/Reportes/Index.jsx

Requerimientos específicos por pantalla:
1. [cite_start]Módulo de Pedidos: Diseñar una pantalla de detalle de pedido ('Show.jsx') excepcional, separando los datos del cliente, los canales de origen de venta, el desglose de productos comprados y los totales generales en bloques limpios[cite: 161, 162]. [cite_start]Implementar badges estrictos para los estados: borrador (gris), confirmado (verde), preparando (terracota), enviado (azul suave), entregado (verde), cancelado (rojo) y devuelto (rojo)[cite: 161].
2. [cite_start]Control de Pagos: Diseñar la visualización de transacciones monetarias[cite: 163]. [cite_start]Aplicar los estados con badges semánticos rigurosos: pendiente (terracota), pagado (verde), observado (terracota), rechazado (rojo) y reembolsado (rojo)[cite: 163]. [cite_start]Debe incorporarse una nota aclaratoria o banner de advertencia visual muy sutil en la cabecera que informe al operador que: "El registro manual de un pago no equivale a la confirmación automática de fondos bancarios"[cite: 163].
3. [cite_start]Sesiones de LiveSales: Optimizar la interfaz haciéndola cómoda, limpia e intuitiva para ejecutar demostraciones comerciales ágiles[cite: 164]. [cite_start]Mostrar de forma clara los estados de la sesión activa (programada en gris, en_vivo en terracota, finalizada en verde, cancelada en rojo)[cite: 164]. [cite_start]Diseñar bloques visuales atractivos para los productos asociados a la transmisión, el panel de lectura de interacciones manuales y botones claros para "Convertir interacción en Lead" o "Crear Pedido Directo"[cite: 164]. [cite_start]Mantener la claridad en la UI de que el proceso es manual y no conecta con APIs externas[cite: 164].
4. [cite_start]Dashboard de Reportes: Organizar de forma simétrica los campos y selectores de filtros[cite: 165]. [cite_start]Reemplazar visualizaciones complejas por tarjetas de KPI prominentes con tipografía elegante para métricas clave y tablas prolijas mediante 'TableWrapper'[cite: 165]. [cite_start]Renderizar 'EmptyState.jsx' si no hay datos en el rango seleccionado[cite: 165]. [cite_start]No implementar descargas a archivos PDF/Excel para cuidar el alcance estricto del frontend[cite: 165].
```

#### Archivos que debe leer el desarrollador / IA antes de iniciar[cite: 80]:
* `resources/js/Pages/Pedidos/*` [cite: 88]
* `resources/js/Pages/Pagos/*` [cite: 88]
* `resources/js/Pages/LiveSales/*` [cite: 88]
* `resources/js/Pages/Reportes/*` [cite: 88]

---

## 9. Protocolo Estricto de Revisión y Cierre (QA)

Siempre hacer revisiones y pruebas para verificar que no haya errores en el código y en su compilación.