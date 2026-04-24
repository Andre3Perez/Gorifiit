# 📚 Documentación API - GORIFIT

## 🔗 URL Base
```
http://localhost:5000/api
```

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para la autenticación.

### Headers Requeridos

Para endpoints protegidos, incluir en cada request:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## 📋 Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

## 📦 Módulos

La API está organizada en los siguientes módulos:

1. **[Autenticación](./AUTH.md)** - `/api/auth`
   - Registro de usuarios
   - Login
   - Perfil de usuario

2. **[Productos](./PRODUCTS.md)** - `/api/products`
   - CRUD de productos
   - Consulta de inventario
   - Estadísticas de productos

3. **[Movimientos](./MOVEMENTS.md)** - `/api/movements`
   - Registro de entradas/salidas
   - Historial de movimientos
   - Estadísticas de movimientos

## 🔒 Roles de Usuario

- **user**: Usuario estándar (puede ver y crear movimientos)
- **admin**: Administrador (permisos completos, puede eliminar productos)

## 📊 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## 🛠️ Testing con cURL

Ejemplo básico de cómo hacer una petición:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'

# Obtener productos (con token)
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer <tu-token-aquí>"
```

## 📱 Testing con Postman

1. Importa la colección desde `POSTMAN_COLLECTION.json`
2. Configura la variable de entorno `baseUrl` = `http://localhost:5000/api`
3. Después del login, el token se guardará automáticamente

## 🔄 Variables de Entorno

Las siguientes variables deben estar configuradas en `.env`:

```env
PORT=5000
HOST=0.0.0.0
MONGODB_URI=mongodb://localhost:27017/gorifit
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=tu_clave_secreta
JWT_EXPIRE=7d
```

## 📝 Notas Importantes

- Todas las fechas están en formato ISO 8601
- Los precios están en pesos colombianos (COP) sin decimales
- Las transacciones de inventario son atómicas (usan MongoDB transactions)
- Los productos eliminados son soft-delete (no se borran físicamente)
