# PRUEBA FUNCIONAL MVP - AKINOMASS

## 1. Objetivo de la prueba
Validar de punta a punta que el MVP de AKINOMASS funciona de forma operativa, coherente y navegable antes del pulido visual, verificando flujos críticos de CRM, catálogo, inventario, pedidos, pagos, LiveSales, plantillas, dashboard y reportes.

## 2. Alcance del MVP probado
Esta guía cubre exclusivamente funcionalidades ya implementadas en AKINOMASS:

- Seguridad con roles y permisos.
- Canales de venta y tipos de flujo comercial.
- Clientes y leads.
- Plantillas de mensajes (uso manual).
- Categorías y productos.
- Inventario y movimientos.
- Pedidos y pagos.
- LiveSales manual.
- Dashboard comercial.
- Reportes básicos con filtros.
- Navegación condicionada por permisos.

Fuera de alcance:

- Integraciones externas (TikTok API, WhatsApp API, etc.).
- Bots, webhooks, automatizaciones de mensajería.
- FastAPI.
- Nuevos módulos o rediseño visual.

## 3. Usuarios demo disponibles
Ejecutar la prueba con al menos estos perfiles:

- Administrador.
- Supervisor Comercial.
- Vendedor.
- Encargado de Inventario.
- Encargado de Pedidos.
- Analista.

> Nota: si en tu entorno demo existe una nomenclatura distinta para los usuarios, mapear cada usuario al rol equivalente.

## 4. Credenciales demo
Usar las credenciales demo cargadas por el proyecto (seeders o datos controlados). Registrar en este bloque las credenciales reales del entorno local antes de iniciar:

- Administrador: `________________` / `________________`
- Supervisor Comercial: `________________` / `________________`
- Vendedor: `________________` / `________________`
- Encargado de Inventario: `________________` / `________________`
- Encargado de Pedidos: `________________` / `________________`
- Analista: `________________` / `________________`

## 5. Prueba de navegación por roles
1. Iniciar sesión con **Administrador**.
2. Validar acceso a todos los módulos del menú.
3. Cerrar sesión.
4. Repetir con cada rol demo.
5. Confirmar:
   - El rol solo ve módulos autorizados.
   - No hay enlaces visibles a módulos no permitidos.
   - Al intentar ruta directa no permitida (URL manual), el sistema responde con bloqueo/403/redirección esperada.

**Resultado esperado:** no existe escalamiento de privilegios por UI ni por URL directa.

## 6. Prueba de CRM

### 6.1 Listar clientes
- Entrar a módulo Clientes.
- Confirmar que lista carga sin error.
- Verificar búsqueda/filtros (si aplica).

### 6.2 Crear cliente
- Crear cliente con datos válidos.
- Guardar.
- Verificar que aparece en listado.

### 6.3 Listar leads
- Entrar a módulo Leads.
- Validar carga de tabla/listado.

### 6.4 Crear lead
- Crear lead con:
  - canal de origen,
  - tipo de flujo comercial,
  - datos de contacto.
- Guardar y validar persistencia.

### 6.5 Cambiar estado de lead
- Seleccionar lead creado.
- Cambiar estado (ej. nuevo → contactado/interesado).
- Confirmar actualización en vista.

### 6.6 Convertir lead a cliente
- Ejecutar acción de conversión.
- Verificar:
  - lead marcado como convertido (o estado equivalente),
  - cliente generado y visible en módulo Clientes,
  - sin duplicados evidentes.

## 7. Prueba de catálogo

### 7.1 Listar categorías
- Abrir módulo Categorías.
- Confirmar listado visible.

### 7.2 Crear categoría
- Crear categoría nueva.
- Validar aparición inmediata en listado.

### 7.3 Listar productos
- Abrir módulo Productos.
- Verificar listado y relación con categoría (si se muestra).

### 7.4 Crear producto
- Crear producto con categoría y precio.
- Guardar y confirmar persistencia en listado.

## 8. Prueba de inventario

### 8.1 Crear/actualizar inventario
- Abrir módulo Inventario.
- Crear registro de stock para un producto nuevo o actualizar existente.

### 8.2 Registrar entrada
- Registrar movimiento tipo **entrada**.
- Confirmar aumento de stock.

### 8.3 Registrar salida
- Registrar movimiento tipo **salida**.
- Confirmar descuento de stock.

### 8.4 Registrar ajuste
- Registrar movimiento tipo **ajuste**.
- Confirmar nuevo stock final.

### 8.5 Verificar movimientos
- Revisar historial/módulo de movimientos.
- Confirmar trazabilidad: fecha, tipo, cantidad, usuario, observación.

### 8.6 Verificar stock bajo
- Llevar un producto a umbral bajo (si existe alerta).
- Validar que aparece como stock bajo en inventario/dashboard/reporte según implementación.

## 9. Prueba de pedidos

### 9.1 Crear pedido en borrador
- Crear pedido con cliente y al menos un producto.
- Guardar en estado borrador.

### 9.2 Editar pedido en borrador
- Modificar cantidades/productos.
- Guardar cambios.

### 9.3 Confirmar pedido
- Ejecutar confirmación de pedido.
- Verificar cambio de estado a confirmado.

### 9.4 Validar descuento de stock
- Revisar inventario del/los producto(s) del pedido.
- Confirmar descuento correcto según cantidad confirmada.

### 9.5 Cancelar pedido confirmado
- Ejecutar cancelación del pedido confirmado.
- Verificar estado final cancelado.

### 9.6 Validar devolución de stock si corresponde
- Confirmar devolución/reversión de stock conforme a la lógica implementada.
- Revisar que quede trazado en movimientos de inventario.

## 10. Prueba de pagos

### 10.1 Registrar pago
- Registrar pago asociado a pedido.
- Validar estado inicial esperado (ej. pendiente/observado).

### 10.2 Observar pago
- Marcar o actualizar pago a estado observado (si el flujo lo permite).
- Confirmar reflejo en UI.

### 10.3 Rechazar pago
- Ejecutar rechazo de un pago de prueba.
- Verificar estado rechazado y consistencia visual.

### 10.4 Confirmar pago
- Confirmar pago válido.
- Validar estado final pagado/confirmado y reflejo en pedido (si aplica).

## 11. Prueba de LiveSales

### 11.1 Crear sesión live
- Crear sesión live manual.
- Confirmar guardado.

### 11.2 Asociar producto
- Asociar al menos un producto ofrecido.
- Verificar vínculo visible.

### 11.3 Registrar interacción
- Registrar interacción con alias/referencia y comentario de intención.

### 11.4 Convertir interacción a lead
- Ejecutar conversión.
- Validar que lead se crea con canal/flujo correcto.

### 11.5 Convertir interacción a pedido
- Ejecutar conversión directa a pedido (si el módulo lo contempla).
- Validar pedido generado y trazabilidad.

## 12. Prueba de plantillas

### 12.1 Listar plantillas
- Abrir módulo Plantillas.
- Confirmar listado.

### 12.2 Crear plantilla
- Crear plantilla de prueba.
- Verificar persistencia.

### 12.3 Editar plantilla
- Editar texto/tipo/estado visible.
- Guardar y validar cambios.

### 12.4 Activar/desactivar plantilla
- Cambiar estado activa/inactiva.
- Confirmar resultado en listado.

### 12.5 Verificar uso manual
- Confirmar que la plantilla solo se usa como texto sugerido (copiar/adaptar manualmente).
- Verificar que no existen envíos automáticos desde el sistema.

## 13. Prueba de dashboard

### 13.1 Revisar métricas principales
- Ingresar a Dashboard.
- Revisar métricas clave (ventas, pedidos, pagos, leads, stock bajo u otras existentes).
- Validar coherencia básica con datos cargados durante la prueba.

### 13.2 Limpiar caché si no se actualiza
Si una métrica no refleja cambios recientes:

1. Ejecutar `php artisan cache:clear`.
2. Recargar dashboard.
3. Confirmar actualización.

## 14. Prueba de reportes

### 14.1 Filtrar por fechas
- Aplicar rango de fechas y validar cambio en resultados.

### 14.2 Filtrar por estado
- Filtrar por estado (lead/pedido/pago según reporte).
- Verificar consistencia.

### 14.3 Filtrar por canal
- Filtrar por canal de venta.
- Validar resultados esperados.

### 14.4 Filtrar por tipo de flujo
- Filtrar por tipo de flujo comercial.
- Confirmar comportamiento correcto.

## 15. Checklist de aceptación final
Marcar cada punto al finalizar:

- [ ] No hay pantallas en blanco ni errores bloqueantes.
- [ ] Navegación por roles funciona correctamente.
- [ ] CRUD base de CRM (clientes/leads) funcional.
- [ ] Conversión lead → cliente funcional.
- [ ] CRUD base de catálogo (categorías/productos) funcional.
- [ ] Inventario y movimientos mantienen trazabilidad.
- [ ] Flujo pedido borrador → confirmado → cancelado funcional.
- [ ] Stock se descuenta y/o devuelve según reglas actuales.
- [ ] Flujo de pagos (registrar/observar/rechazar/confirmar) funcional.
- [ ] LiveSales permite registro y conversiones manuales.
- [ ] Plantillas son solo soporte manual (sin automatización).
- [ ] Dashboard muestra métricas sin inconsistencias graves.
- [ ] Reportes filtran por fecha/estado/canal/flujo.

## 16. Errores comunes y cómo detectarlos
- **Permisos mal configurados:** menú visible pero acceso 403 en acción clave.
- **Ruta rota de frontend:** botón navega a 404 o componente no renderiza.
- **Estados no actualizan:** acción se ejecuta pero tabla mantiene estado viejo (posible caché).
- **Stock inconsistente:** confirmar/cancelar pedido no impacta inventario correctamente.
- **Duplicación de cliente al convertir lead:** aparece cliente repetido con mismos datos.
- **Pago confirmado sin reflejo en pedido:** inconsistencia de estado entre módulos.
- **Filtro de reportes no aplica:** resultados no cambian al modificar criterios.
- **Plantillas con expectativa incorrecta:** usuario espera envío automático (recordar que es manual).

## 17. Comandos locales de verificación
Ejecutar al cierre de la auditoría funcional:

```bash
php artisan config:clear
php artisan cache:clear
php artisan migrate:status
npm run build
php artisan route:list
```

Si hay comportamientos extraños de datos o permisos, repetir:

```bash
php artisan config:clear
php artisan cache:clear
```

---

## Registro de ejecución (sugerido)
Para cada prueba ejecutada, registrar:

- Fecha/hora.
- Usuario/rol usado.
- Caso probado.
- Resultado (OK / Falla).
- Evidencia (captura o nota).
- Observación de corrección requerida.
