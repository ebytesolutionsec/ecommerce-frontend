# E-commerce Frontend

Proyecto frontend de e-commerce desarrollado con Vue 3, Vite y Tailwind CSS.

## Estructura del proyecto

```
ecommerce-front/
├── client/                 # Aplicación Vue
│   ├── src/
│   │   ├── components/
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── package.json           # Scripts raíz
└── README.md
```

## Tecnologías

- **Vue 3** - Framework progresivo de JavaScript
- **Vite** - Build tool y dev server ultra rápido
- **Tailwind CSS v4** - Framework de CSS utility-first
- **PostCSS** - Procesador de CSS

## Instalación

Instalar todas las dependencias:
```bash
npm install
```

## Desarrollo

Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build

Crear build de producción:
```bash
npm run build
```

Los archivos compilados estarán en `client/dist/`

## Preview

Previsualizar el build de producción:
```bash
npm run preview
```

## Configuración de Tailwind CSS

Este proyecto usa Tailwind CSS v4 con la nueva sintaxis:
- El plugin de PostCSS es `@tailwindcss/postcss`
- Los estilos se importan con `@import "tailwindcss"` en lugar de directivas `@tailwind`
