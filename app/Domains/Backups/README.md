# Backups Domain

Módulo de backups incrementales lógicos para la base de datos de AKINOMASS.

## Estructura

```
Backups/
├── Actions/        → Casos de uso
├── DTOs/           → Objetos de transferencia de datos
├── Enums/          → Tipos y estados
├── Services/       → Lógica de negocio
├── Repositories/   → Acceso a datos
```

## Funcionalidad

- **Backup base**: Primera ejecución, exporta todas las tablas configuradas
- **Backup incremental**: Ejecuciones posteriores, exporta registros creados/modificados desde el último backup exitoso
- **Formato**: Archivos ZIP con `manifest.json` + JSON por tabla
- **Almacenamiento**: `storage/app/private/backups_bd/` (volumen Docker dedicado)
- **Acceso**: Solo usuarios con permiso `backups.ver`
