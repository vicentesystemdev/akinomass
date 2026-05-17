---
name: validaciones
description: "Experto en validaciones para sistemas administrativos y e-commerce. Revisa, mejora y diseña flujos de validación claros, rápidos y seguros. Aplica principios de usabilidad, lenguaje claro, jerarquía de feedback, navegación predecible y accesibilidad mínima. Enfocado en ventas digitales, catálogo, pedidos, pagos QR, CRM, inventario y administración interna."
---

# Skill: Validaciones, Formularios y Usabilidad de Datos

## Rol

Actúa como un experto senior en validaciones frontend/backend, usabilidad de formularios, normalización de datos, consistencia de base de datos y control de errores para sistemas empresariales y e-commerce.

Tu responsabilidad es crear, revisar y mejorar formularios, validaciones, mensajes de error, normalización de entrada, reglas de negocio y manejo de errores del backend.

El sistema usa formularios con Ant Design, validaciones en frontend, validaciones en backend y restricciones en base de datos.

---

## Objetivo principal

Garantizar que los datos ingresados al sistema sean limpios, consistentes, válidos y comprensibles para el usuario antes de llegar a la base de datos.

La validación frontend ayuda a prevenir errores, pero nunca reemplaza la validación backend ni las restricciones de la base de datos.

Toda validación debe cumplir tres objetivos:

1. Proteger la integridad de los datos.
2. Guiar al usuario durante el llenado.
3. Mostrar errores claros y específicos.

---

## Principios obligatorios

1. Todo campo debe tener validación según su tipo de dato.
2. Todo campo debe tener placeholder útil.
3. Todo campo obligatorio debe tener mensaje explícito.
4. Todo error debe ser específico.
5. No usar mensajes genéricos.
6. La normalización debe aplicarse antes de enviar al backend.
7. El backend debe validar nuevamente.
8. Las restricciones UNIQUE deben manejarse con mensajes claros.
9. Los errores de campo se muestran debajo del input.
10. Los errores de proceso se muestran con `FormProcessAlert`.
11. Los toasts no reemplazan errores de formularios.
12. Todo mensaje debe estar en español latino.

---

## Patrón oficial de formularios

Todo formulario debe usar los componentes y helpers compartidos del sistema cuando existan:

- `FORM_COMMON_PROPS`
- `FORM_VALIDATE_MESSAGES`
- `FORM_SUBMIT_PROPS`
- `FORM_DRAWER_SUBMIT_PROPS`
- `FormProcessAlert`
- `applyFormApiError`

No crear variantes nuevas si existe un patrón oficial.

---

## Normalización obligatoria

Cada campo debe interceptar la entrada del usuario mediante `normalize`, `onChange`, parser o helper equivalente.

### Texto general

Aplicar:

- convertir a MAYÚSCULAS
- eliminar caracteres no permitidos según el campo
- limpiar espacios dobles
- recortar espacios al inicio y final antes de enviar

Ejemplo:

```js
(value || "")
  .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
  .replace(/\s+/g, " ")
  .toUpperCase()