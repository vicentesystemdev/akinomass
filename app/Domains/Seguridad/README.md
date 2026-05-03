# Dominio Seguridad

Este dominio contiene la lógica relacionada con usuarios, roles, permisos y control de acceso del sistema AKINOMASS.

Se apoya en Spatie Permission para manejar autorización basada en roles y permisos.

## Responsabilidades

- Administración de usuarios.
- Administración de roles.
- Administración de permisos.
- Asignación de roles a usuarios.
- Asignación de permisos a roles.
- Validaciones de acceso por módulo.
- Soporte a policies y middleware de autorización.

## Submódulos

- Usuarios
- Roles
- Permisos

## Reglas

- No mezclar lógica de seguridad dentro de CRM, Comercial, Inventario o Reportes.
- Los permisos deben definirse como datos iniciales mediante seeders.
- El modelo User se mantiene en `app/Models/User.php` por convención de Laravel.
- El modelo User debe usar el trait `HasRoles` de Spatie Permission.

## Roles iniciales sugeridos

- Administrador
- Supervisor Comercial
- Vendedor
- Encargado de Inventario
- Encargado de Pedidos
- Analista
