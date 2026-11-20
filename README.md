# Frontend — Gestión de cursos preparatorios de maestría

Interfaz React para coordinador, tutor, postulante y administrador. Este repositorio contiene únicamente el frontend. No incluye servidor, reglas de backend ni conexión a SQL Server.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Abre la dirección que Vite muestra (normalmente http://localhost:5173). El selector de rol cambia entre vistas de demostración; no autentica usuarios.

## Generar archivos para publicar

```bash
npm run build
npm run preview
```

## Integración futura con FastAPI

El frontend usa datos de demostración. `src/services/apiClient.js` centraliza la llamada HTTP y la configuración `VITE_API_BASE_URL`; el cliente todavía no se usa para persistir pantallas ni se conecta a una API existente. Al integrar FastAPI, sustituye las fuentes mock por servicios por módulo, define los contratos JSON con el backend y aplica autenticación/permisos desde la API. El navegador no debe conectarse directamente a SQL Server.

Copia `.env.example` a `.env.local` y ajusta `VITE_API_BASE_URL` cuando exista el servidor. Las variables `VITE_*` son públicas; nunca coloques secretos en ellas.

## Comportamientos locales

- Navegación entre todas las vistas principales de los cuatro roles.
- Búsqueda global con el botón de búsqueda o `Ctrl+K`.
- Filtros y búsqueda en listados.
- Formularios de demostración en diálogos nativos, avisos de confirmación, preferencias y acciones rápidas.
- Los archivos seleccionados solo se muestran localmente y no se suben a ningún servidor.
- Exportaciones demo generan un CSV local a partir de los datos visibles.

Los nombres, personas, fechas y métricas son ficticios.
# Sistema-Gestion-Cursos
