# Client Management Website

Sistema web de gestión de clientes desarrollado con Angular y Firebase Firestore.

## Descripción

Aplicación web para administrar información de clientes, con funcionalidades de autenticación, dashboard y operaciones CRUD. Implementa una arquitectura limpia (Clean Architecture) separando las capas de dominio, datos y presentación.

## Tecnologías

- **Frontend:** Angular 15, TypeScript
- **UI:** Angular Material, Tailwind CSS, ng-icons (Heroicons)
- **Backend:** Firebase (Firestore, Authentication)
- **Testing:** Jasmine, Karma

## Instalación

```bash
npm install
```

## Uso

### Desarrollo

```bash
npm start
```

Navegar a `http://localhost:4200/`. La aplicación se recarga automáticamente ante cambios.

### Build

```bash
npm run build
```

Los archivos generados se almacenan en `dist/`.

### Tests

```bash
npm test
```

Ejecuta tests unitarios con Karma.

## Arquitectura

El proyecto sigue Clean Architecture:

- **domain/** - Modelos, repositorios (interfaces) y casos de uso
- **data/** - DTOs, mappers e implementación de repositorios
- **presentation/** - Componentes UI organizados por features (auth, dashboard)

## Características

- Autenticación de usuarios con Firebase Auth
- Dashboard con listado de clientes
- Operaciones CRUD sobre clientes
- Búsqueda, filtrado y ordenamiento de datos
- Diseño responsive con Material + Tailwind

## Limitaciones

### Paginación

La paginación se realiza de forma básica debido a limitaciones de Firestore:
- No soporta saltos eficientes (offset) sin leer documentos previos
- La paginación por cursor requiere conocer el último documento visible
- Para listas grandes, esto puede impactar en costos de lectura

### Filtrado y Ordenamiento

El filtrado y ordenamiento se realizan **en el frontend** por practicidad:
- Firestore tiene limitaciones en consultas compuestas (requiere índices manuales)
- No permite combinar múltiples filtros con ordenamiento dinámico fácilmente
- Procesar datos en cliente simplifica la lógica y evita crear índices para cada combinación
- Aceptable para volúmenes moderados de datos; reconsiderar para grandes volúmenes

## Manejo de Fechas

- `createdAt` y `updatedAt` se almacenan como strings ISO (`YYYY-MM-DDTHH:mm:ss.sssZ`) en Firestore
- Se eligió este formato para simplificar el manejo en el frontend y evitar objetos `Timestamp` de Firestore
- Facilita el ordenamiento y visualización en cliente
- Las marcas de tiempo se generan en el cliente, no en el servidor Firestore
- Si se requiere tiempo de servidor garantizado o auditoría estricta, migrar a `serverTimestamp()` y normalizar en lectura
