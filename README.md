# 🏋️ GORIFIT - Sistema de Gestión de Inventario

Sistema completo de gestión de inventario desarrollado con Next.js y Node.js para el negocio GORIFIT.

## 📋 Descripción

Sistema que permite llevar un control de inventario en tiempo real, registrando productos, entradas y salidas, evitando errores y mostrando información precisa en todo momento.

## 🧩 Tecnologías Utilizadas

### Backend
- **Node.js** con Express
- **MongoDB** (Mongoose)
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas
- Middleware de seguridad (Helmet, CORS, Compression)

### Frontend
- **Next.js 14** (React)
- **TailwindCSS** (Estilo neumórfico)
- **Sonner** para notificaciones
- **Axios** para peticiones HTTP

---

## 📦 Características Principales

### ✅ Gestión de Productos
- Crear, editar y eliminar productos
- Campos: nombre, categoría, precio, stock, stock mínimo
- Alertas de stock bajo
- Vista de productos por categoría

### 🔄 Movimientos de Inventario
- Registrar entradas (aumenta stock)
- Registrar salidas (disminuye stock)
- Validaciones de stock negativo
- Historial completo con filtros

### 📊 Dashboard
- Estadísticas en tiempo real
- Productos con stock bajo
- Valor total del inventario
- Gráficos por categoría

### 🔐 Autenticación
- Registro de usuarios
- Login con JWT
- Rutas protegidas
- Roles de usuario

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ instalado
- MongoDB Atlas cuenta (o MongoDB local)
- npm o yarn

### Paso 1: Clonar o descargar el proyecto

```bash
cd gorifit-test
```

### Paso 2: Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

```

### Paso 3: Configurar Frontend

```bash
# Abrir una nueva terminal y navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# El archivo .env.local ya está configurado:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ▶️ Ejecutar el Proyecto

### Ejecutar Backend y Frontend por separado

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
El backend estará corriendo en: `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
El frontend estará corriendo en: `http://localhost:3000`



## 👤 Primer Uso

### 1. Crear Usuario Administrador

Una vez que el backend esté corriendo, crear el primer usuario desde Thunder Client, Postman o similar:

**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Body (JSON):**
```json
{
  "username": "admin",
  "email": "admin@gorifit.com",
  "password": "123456",
  "role": "admin"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "...",
    "username": "admin",
    "email": "admin@gorifit.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Iniciar Sesión en la Aplicación

1. Abrir `http://localhost:3000`
2. Usar las credenciales:
   - **Email:** admin@gorifit.com
   - **Password:** 123456

---

## 📁 Estructura del Proyecto

```
gorifit-test/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   ├── productController.js # CRUD de productos
│   │   └── movementController.js # Gestión de movimientos
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Manejo de errores
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Product.js           # Modelo de producto
│   │   └── Movement.js          # Modelo de movimiento
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── movementRoutes.js
│   ├── .env                     # Variables de entorno
│   ├── server.js                # Servidor principal
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   ├── Navbar.js
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── _app.js
│   │   │   ├── index.js
│   │   │   ├── login.js
│   │   │   ├── dashboard.js
│   │   │   ├── inventario.js
│   │   │   ├── movimientos.js
│   │   │   └── historial.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   └── movementService.js
│   │   └── styles/
│   │       └── globals.css
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🔑 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil (requiere token)

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (requiere auth)
- `PUT /api/products/:id` - Actualizar producto (requiere auth)
- `DELETE /api/products/:id` - Eliminar producto (requiere auth + admin)
- `GET /api/products/stats/overview` - Estadísticas (requiere auth)

### Movimientos
- `GET /api/movements` - Listar movimientos (requiere auth)
- `GET /api/movements/:id` - Obtener movimiento (requiere auth)
- `POST /api/movements/entrada` - Registrar entrada (requiere auth)
- `POST /api/movements/salida` - Registrar salida (requiere auth)
- `GET /api/movements/producto/:id` - Historial de producto (requiere auth)
- `GET /api/movements/stats/overview` - Estadísticas (requiere auth)

---

## 🎨 Características del Frontend

### Diseño Neumórfico
- Estilo moderno con sombras suaves
- Botones con efecto de presión
- Cards flotantes
- Paleta de colores personalizada

### Componentes Reutilizables
- Button, Input, Select
- Modal, Card, StatCard
- Loading, Navbar, Layout

### Notificaciones con Sonner
- Alertas de éxito
- Mensajes de error
- Feedback visual instantáneo

---

## 🔒 Seguridad

- Passwords encriptadas con bcryptjs
- JWT con expiración configurable
- Helmet para headers de seguridad
- CORS configurado
- Validación de datos en backend
- Rutas protegidas con middleware

---

## 🐛 Troubleshooting

### Error de conexión a MongoDB
- Verificar que el URI de MongoDB en `.env` sea correcto
- Confirmar que la IP esté en la whitelist de MongoDB Atlas

### Puerto ya en uso
```bash
# Backend (puerto 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (puerto 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error de CORS
- Verificar que `FRONTEND_URL` en backend apunte al frontend correcto
- Asegurar que el frontend use la URL correcta en `NEXT_PUBLIC_API_URL`

---

## 📝 Notas Adicionales

### Categorías de Productos Disponibles
- Suplementos
- Ropa
- Accesorios
- Equipamiento
- Nutrición
- Otro

### Stock Mínimo
Por defecto, se considera stock bajo cuando hay menos de 5 unidades.
Esto es configurable al crear/editar cada producto.

---

## 👨‍💻 Desarrollo

### Backend
```bash
cd backend
npm run dev  # Inicia con nodemon (recarga automática)
```

### Frontend
```bash
cd frontend
npm run dev  # Inicia Next.js en modo desarrollo
```

---

## 🚀 Producción

### Backend
```bash
cd backend
npm start  # Inicia sin nodemon
```

### Frontend
```bash
cd frontend
npm run build  # Genera build optimizado
npm start      # Inicia servidor de producción
```

---

## 📄 Licencia

MIT

---

## 👥 Autor

Desarrollado para **GORIFIT**

---

## 🆘 Soporte

Para problemas o preguntas, revisar:
1. Este README
2. Logs del backend (consola donde corre `npm run dev`)
3. Logs del frontend (consola del navegador)
4. Network tab en DevTools para ver peticiones HTTP