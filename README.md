# Frontend - Sistema de Inventario

Interfaz de usuario para el sistema de gestión de inventario médico.

## Tecnologías

- React 19
- Vite
- Chakra UI v3
- React Icons

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── services/         # Servicios de API
├── utils/           # Utilidades y validaciones
├── App.jsx          # Componente principal
└── main.jsx         # Punto de entrada
```

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` basado en `.env.example`:

```
VITE_API_URL=http://localhost:3000
```

## Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Características

- ✨ Interfaz moderna y responsive
- 🔍 Búsqueda en tiempo real
- 📊 Dashboard con estadísticas
- 📁 Organización por categorías en acordeón
- ✏️ Edición y eliminación de productos
- ⚡ Validación de datos en el cliente
- 🔒 Sanitización de inputs
- 🎨 Diseño con Chakra UI

## Categorías Disponibles

- Preparacion
- Resinas Fluidas
- Composite
- Ionomeros
- Profilaxis
- Medicamentos
- Insumos
