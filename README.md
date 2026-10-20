# Gestión de Ventas - Backend

API REST para la gestión de artículos y ventas.

## Tecnologías
- Node.js
- Express
- PostgreSQL

## Endpoints
- GET /articulos → búsqueda de articulo
- POST /articulos → crear
- PUT /articulos/:id → actualiza
- DELETE /articulos → borra
- POST /ventas → confirmar venta y descontar stock

## Cómo ejecutar
1. Clonar el repositorio.
2. Instalar dependencias: `npm install`
3. Configurar `db.js` con tus datos de PostgreSQL.
4. Ejecutar: `node index.js`
