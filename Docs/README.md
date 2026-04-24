# 📚 Documentación API GORIFIT

Bienvenido a la documentación completa de la API REST de GORIFIT, un sistema de gestión de inventario para gimnasios y tiendas de suplementos deportivos.

## 📖 Índice de Documentación

### 📄 Documentos Principales

1. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Introducción general
   - URL base y configuración
   - Estructura de respuestas
   - Códigos de estado HTTP
   - Configuración de variables de entorno

2. **[AUTH.md](./AUTH.md)** - Módulo de Autenticación
   - Registro de usuarios
   - Login y generación de tokens JWT
   - Obtener perfil de usuario

3. **[PRODUCTS.md](./PRODUCTS.md)** - Módulo de Productos
   - CRUD completo de productos
   - Consultas con filtros
   - Estadísticas de inventario

4. **[MOVEMENTS.md](./MOVEMENTS.md)** - Módulo de Movimientos
   - Registro de entradas y salidas
   - Historial de movimientos
   - Cálculos de valores monetarios

5. **[EXAMPLES.md](./EXAMPLES.md)** - Ejemplos Prácticos
   - Flujos completos paso a paso
   - Casos de uso reales
   - Ejemplos con cURL, JavaScript y Python

## 🚀 Inicio Rápido

### 1. Instalar y Configurar

```bash
# Clonar el repositorio
git clone <repo-url>

# Instalar dependencias del backend
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor
npm run dev
```

### 2. Hacer tu Primera Request

```bash
# Registrar usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456"
  }'

# Login y obtener token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 3. Usar el Token

```bash
# Guardar el token recibido
TOKEN="tu_token_aqui"

# Hacer requests autenticadas
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Resumen de Endpoints

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Registrar nuevo usuario | No |
| POST | `/login` | Iniciar sesión | No |
| GET | `/me` | Obtener perfil actual | Sí |

### 📦 Productos (`/api/products`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar productos | Sí |
| GET | `/:id` | Obtener producto por ID | Sí |
| POST | `/` | Crear producto | Sí |
| PUT | `/:id` | Actualizar producto | Sí |
| DELETE | `/:id` | Eliminar producto | Sí (Admin) |
| GET | `/stats/overview` | Estadísticas de productos | Sí |

### 🔄 Movimientos (`/api/movements`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar movimientos | Sí |
| GET | `/:id` | Obtener movimiento por ID | Sí |
| POST | `/entrada` | Registrar entrada | Sí |
| POST | `/salida` | Registrar salida | Sí |
| GET | `/producto/:id` | Historial de producto | Sí |
| GET | `/stats/overview` | Estadísticas de movimientos | Sí |

## 🛠️ Herramientas de Testing

### Con Postman

1. Descarga [Postman](https://www.postman.com/downloads/)
2. Crea una nueva colección
3. Agrega la variable `baseUrl` = `http://localhost:5000/api`
4. Importa los endpoints desde la documentación

### Con Thunder Client (VS Code)

1. Instala la extensión Thunder Client
2. Crea un nuevo entorno con `baseUrl`
3. Crea requests según la documentación

### Con cURL (Terminal)

Todos los ejemplos en la documentación usan cURL para facilitar pruebas rápidas desde la terminal.

## 🔒 Seguridad

- **JWT Tokens**: Autenticación basada en tokens JWT
- **Bcrypt**: Contraseñas hasheadas con bcrypt
- **CORS**: Configurado para frontend en desarrollo
- **Validaciones**: Mongoose valida todos los datos de entrada
- **Roles**: Sistema de roles (user/admin) para permisos

## 📊 Base de Datos

### Modelos Principales

```
User
├── username (String, único)
├── email (String, único)
├── password (String, hasheado)
├── role (String: user|admin)
└── isActive (Boolean)

Product
├── nombre (String, único)
├── categoria (String)
├── precio (Number)
├── stock (Number)
├── stockMinimo (Number)
├── descripcion (String)
└── isActive (Boolean)

Movement
├── tipo (String: entrada|salida)
├── producto (ObjectId → Product)
├── cantidad (Number)
├── motivo (String)
├── observaciones (String)
├── usuario (ObjectId → User)
├── stockAnterior (Number)
└── stockNuevo (Number)
```

## 🐛 Solución de Problemas

### El servidor no inicia

```bash
# Verificar que MongoDB esté corriendo
# Verificar que el puerto 5000 esté disponible
# Revisar el archivo .env
```

### Error de autenticación

```bash
# Verificar que el token sea válido
# Asegurarse de incluir "Bearer " antes del token
# Verificar que el token no haya expirado
```

### Error en transacciones

```bash
# MongoDB debe soportar transactions (Replica Set o MongoDB Atlas)
# Verificar la versión de MongoDB (≥ 4.0)
```

## 📞 Soporte

Para preguntas o problemas:
- Revisa la documentación completa
- Consulta los ejemplos prácticos
- Revisa los códigos de error HTTP

## 🔄 Versionamiento

**Versión Actual:** 1.0.0

La API sigue versionamiento semántico:
- **MAJOR**: Cambios incompatibles
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de bugs

## 📝 Licencia

Este proyecto es parte de GORIFIT. Todos los derechos reservados.

---

**¡Feliz codificación! 💪🏋️‍♂️**
