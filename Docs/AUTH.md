# 🔐 Módulo de Autenticación

Base URL: `/api/auth`

---

## 📝 Registrar Usuario

Crea una nueva cuenta de usuario en el sistema.

**Endpoint:** `POST /api/auth/register`  
**Acceso:** Público  
**Autenticación:** No requerida

### Request Body

```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "contraseña123",
  "role": "user"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| username | String | Sí | Nombre de usuario único |
| email | String | Sí | Correo electrónico único |
| password | String | Sí | Contraseña (mínimo 6 caracteres) |
| role | String | No | Rol del usuario: "user" o "admin" (default: "user") |

### Response Success (201)

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "64abc123def456789",
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response Error (400)

```json
{
  "success": false,
  "message": "Por favor proporcione todos los campos requeridos"
}
```

### Ejemplo cURL

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "email": "juan@gorifit.com",
    "password": "password123",
    "role": "user"
  }'
```

---

## 🔓 Login

Inicia sesión y obtiene un token JWT para autenticación.

**Endpoint:** `POST /api/auth/login`  
**Acceso:** Público  
**Autenticación:** No requerida

### Request Body

```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| email | String | Sí | Correo electrónico del usuario |
| password | String | Sí | Contraseña del usuario |

### Response Success (200)

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": "64abc123def456789",
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response Error (401)

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

### Response Error (403)

```json
{
  "success": false,
  "message": "Usuario desactivado"
}
```

### Ejemplo cURL

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@gorifit.com",
    "password": "password123"
  }'
```

---

## 👤 Obtener Perfil Actual

Obtiene los datos del usuario autenticado actualmente.

**Endpoint:** `GET /api/auth/me`  
**Acceso:** Privado  
**Autenticación:** Requerida (Bearer Token)

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

No requiere body.

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "_id": "64abc123def456789",
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response Error (401)

```json
{
  "success": false,
  "message": "No autorizado"
}
```

### Ejemplo cURL

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📌 Notas Importantes

1. **Token JWT**: Guarda el token recibido en login/register para usarlo en todas las peticiones protegidas
2. **Expiración**: Los tokens expiran en 7 días por defecto (configurable en `JWT_EXPIRE`)
3. **Formato del Token**: Siempre debe incluirse con el prefijo "Bearer " en el header Authorization
4. **Seguridad**: 
   - Las contraseñas se encriptan con bcrypt antes de guardarse
   - Nunca se devuelve la contraseña en las respuestas
   - Los usuarios inactivos no pueden iniciar sesión
