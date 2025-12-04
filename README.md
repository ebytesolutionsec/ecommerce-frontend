# Proyecto E-commerce

Proyecto de e-commerce con arquitectura full-stack separada en frontend y backend.

## Estructura del proyecto

```
proyecto-ecommerce/
├── client/                 # Frontend (Vue + Vite + Tailwind)
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Backend (Node + Express)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── index.js
│   └── package.json
├── package.json           # Scripts raíz
└── README.md
```

## Tecnologías

### Frontend
- Vue 3
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- CORS
- Dotenv

## Instalación

### Instalar todas las dependencias
```bash
npm run install:all
```

### O instalar por separado
```bash
npm run install:client
npm run install:server
```

## Desarrollo

### Ejecutar el frontend
```bash
npm run dev:client
```
El frontend estará disponible en `http://localhost:5173`

### Ejecutar el backend
```bash
npm run dev:server
```
El backend estará disponible en `http://localhost:3000`

## Configuración

### Backend
1. Copia el archivo `.env.example` a `.env` en la carpeta `server/`
2. Configura las variables de entorno según tus necesidades

## Build

### Build del frontend
```bash
npm run build:client
```

### Ejecutar el servidor en producción
```bash
npm run start:server
```
