# Arquitectura de AKINOMASS

AKINOMASS utiliza una arquitectura basada en Laravel como monolito modular, apoyado en el patrón MVC del framework y organizado internamente por dominios funcionales.

## Tipo de arquitectura

El sistema utiliza:

- MVC como base de Laravel.
- Monolito modular.
- Arquitectura por capas.
- Organización por dominios funcionales.
- Events y Listeners para comunicación secundaria entre dominios.
- Redis para cache, sesiones, colas y dashboards.
- Preparación futura para integración con FastAPI como servicio analítico paralelo.

## Stack principal

- Laravel 13
- PHP 8.3
- PostgreSQL
- Redis
- Laravel Queue
- Spatie Permission
- Laravel Sanctum
- Inertia.js
- React
- Tailwind CSS
- Vite
- Breeze React

## Estructura principal

app/
├── Domains/
├── Http/
├── Models/
├── Providers/
└── Support/

## Dominios

- Seguridad
- CRM
- Comercial
- Catalogo
- Inventario
- Reportes
- Dashboard
- Analytics
- Shared

## Flujo recomendado

Controller → FormRequest → DTO → Action → Service → Repository → Model

## Regla principal

Los controladores no deben contener lógica de negocio.

## Alcance de integración multicanal

AKINOMASS no integrará APIs externas de redes sociales en su primera versión. El enfoque multicanal se manejará mediante registro manual estructurado, permitiendo identificar el origen de cada lead, cliente, pedido o interacción comercial. Esto permite obtener trazabilidad y reportes por canal sin asumir costos ni complejidad de integración con plataformas externas.

## Enfoque multicanal manual estructurado

AKINOMASS no implementa una integración automática con APIs externas de redes sociales en su primera versión.

El enfoque multicanal se basa en el registro manual estructurado de interacciones, leads, clientes y pedidos, permitiendo identificar el canal de origen y el tipo de flujo comercial.

Esta decisión reduce costos, dependencia técnica y complejidad de integración con plataformas externas, manteniendo el foco en CRM, pedidos, inventario, pagos, reportes y dashboards.

## Canal de origen y flujo comercial

El sistema diferencia dos conceptos:

- Canal de origen: medio desde el cual llega la interacción o posible venta.
- Tipo de flujo comercial: dinámica comercial bajo la cual se atiende la interacción.

Ejemplo:

- Canal: TikTok LIVE
- Flujo: venta_en_vivo

- Canal: WhatsApp
- Flujo: conversacion_directa

- Canal: Facebook
- Flujo: marketplace

Esta separación permite generar reportes más claros y preparar el sistema para futuros procesos de automatización sin rehacer la arquitectura.
