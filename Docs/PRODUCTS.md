# 📦 Módulo de Productos

Base URL: `/api/products`

**Nota:** Todos los endpoints requieren autenticación (Bearer Token)

---

## 📋 Listar Productos

Obtiene la lista de todos los productos activos del inventario.

**Endpoint:** `GET /api/products`  
**Acceso:** Privado  
**Autenticación:** Requerida

### Headers

```http
Authorization: Bearer <token>
```

### Query Parameters (Opcionales)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| categoria | String | Filtra por categoría específica |
| stockBajo | Boolean | Si es "true", solo muestra productos con stock bajo |

### Response Success (200)

```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "64abc123def456789",
      "nombre": "Creatina Monohidrato 500g",
      "categoria": "Suplementos",
      "precio": 75000,
      "stock": 45,
      "stockMinimo": 10,
      "descripcion": "Creatina pura micronizada",
      "imagen": "https://example.com/creatina.jpg",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    }
  ]
}
```

### Ejemplos cURL

```bash
# Obtener todos los productos
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>"

# Filtrar por categoría
curl -X GET "http://localhost:5000/api/products?categoria=Suplementos" \
  -H "Authorization: Bearer <token>"

# Solo productos con stock bajo
curl -X GET "http://localhost:5000/api/products?stockBajo=true" \
  -H "Authorization: Bearer <token>"
```

---

## 🔍 Obtener Producto por ID

Obtiene los detalles de un producto específico.

**Endpoint:** `GET /api/products/:id`  
**Acceso:** Privado  
**Autenticación:** Requerida

### Headers

```http
Authorization: Bearer <token>
```

### URL Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | String | ID del producto (MongoDB ObjectId) |

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "_id": "64abc123def456789",
    "nombre": "Creatina Monohidrato 500g",
    "categoria": "Suplementos",
    "precio": 75000,
    "stock": 45,
    "stockMinimo": 10,
    "descripcion": "Creatina pura micronizada",
    "imagen": "https://example.com/creatina.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T15:45:00.000Z"
  }
}
```

### Response Error (404)

```json
{
  "success": false,
  "message": "Producto no encontrado"
}
```

### Ejemplo cURL

```bash
curl -X GET http://localhost:5000/api/products/64abc123def456789 \
  -H "Authorization: Bearer <token>"
```

---

## ➕ Crear Producto

Crea un nuevo producto en el inventario.

**Endpoint:** `POST /api/products`  
**Acceso:** Privado  
**Autenticación:** Requerida

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "nombre": "Proteína Whey 2kg",
  "categoria": "Suplementos",
  "precio": 150000,
  "stock": 20,
  "stockMinimo": 5,
  "descripcion": "Proteína de suero de leche sabor chocolate",
  "imagen": "https://example.com/whey.jpg"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| nombre | String | Sí | Nombre único del producto |
| categoria | String | Sí | Categoría: "Suplementos", "Ropa", "Accesorios", "Equipamiento", "Nutrición", "Otro" |
| precio | Number | Sí | Precio en pesos (debe ser ≥ 0) |
| stock | Number | No | Stock inicial (default: 0) |
| stockMinimo | Number | No | Stock mínimo para alertas (default: 5) |
| descripcion | String | No | Descripción del producto |
| imagen | String | No | URL de la imagen del producto |

### Response Success (201)

```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "_id": "64abc123def456789",
    "nombre": "Proteína Whey 2kg",
    "categoria": "Suplementos",
    "precio": 150000,
    "stock": 20,
    "stockMinimo": 5,
    "descripcion": "Proteína de suero de leche sabor chocolate",
    "imagen": "https://example.com/whey.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Ejemplo cURL

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "BCAA 2:1:1 300g",
    "categoria": "Suplementos",
    "precio": 85000,
    "stock": 15,
    "stockMinimo": 5,
    "descripcion": "Aminoácidos ramificados"
  }'
```

---

## ✏️ Actualizar Producto

Actualiza los datos de un producto existente. **Nota:** El stock NO se actualiza aquí, solo mediante movimientos.

**Endpoint:** `PUT /api/products/:id`  
**Acceso:** Privado  
**Autenticación:** Requerida

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### URL Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | String | ID del producto a actualizar |

### Request Body

```json
{
  "nombre": "Creatina Monohidrato 1kg",
  "precio": 120000,
  "descripcion": "Nueva presentación de 1kg",
  "stockMinimo": 8
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizan los campos enviados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | String | Nuevo nombre del producto |
| categoria | String | Nueva categoría |
| precio | Number | Nuevo precio |
| stockMinimo | Number | Nuevo stock mínimo |
| descripcion | String | Nueva descripción |
| imagen | String | Nueva URL de imagen |

### Response Success (200)

```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "_id": "64abc123def456789",
    "nombre": "Creatina Monohidrato 1kg",
    "categoria": "Suplementos",
    "precio": 120000,
    "stock": 45,
    "stockMinimo": 8,
    "descripcion": "Nueva presentación de 1kg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-21T09:15:00.000Z"
  }
}
```

### Response Error (404)

```json
{
  "success": false,
  "message": "Producto no encontrado"
}
```

### Ejemplo cURL

```bash
curl -X PUT http://localhost:5000/api/products/64abc123def456789 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 130000,
    "stockMinimo": 10
  }'
```

---

## 🗑️ Eliminar Producto

Elimina un producto del inventario (soft delete - solo lo marca como inactivo).

**Endpoint:** `DELETE /api/products/:id`  
**Acceso:** Privado/Admin  
**Autenticación:** Requerida (Solo usuarios con rol "admin")

### Headers

```http
Authorization: Bearer <token>
```

### URL Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | String | ID del producto a eliminar |

### Response Success (200)

```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

### Response Error (404)

```json
{
  "success": false,
  "message": "Producto no encontrado"
}
```

### Response Error (403)

```json
{
  "success": false,
  "message": "No autorizado para esta acción"
}
```

### Ejemplo cURL

```bash
curl -X DELETE http://localhost:5000/api/products/64abc123def456789 \
  -H "Authorization: Bearer <token>"
```

---

## 📊 Estadísticas de Productos

Obtiene estadísticas generales del inventario.

**Endpoint:** `GET /api/products/stats/overview`  
**Acceso:** Privado  
**Autenticación:** Requerida

### Headers

```http
Authorization: Bearer <token>
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "totalProductos": 25,
    "productosBajoStock": 3,
    "valorTotalInventario": 5750000,
    "productosSinStock": 1,
    "porCategoria": {
      "Suplementos": {
        "count": 15,
        "valor": 3500000
      },
      "Ropa": {
        "count": 8,
        "valor": 1800000
      },
      "Accesorios": {
        "count": 2,
        "valor": 450000
      }
    }
  }
}
```

### Ejemplo cURL

```bash
curl -X GET http://localhost:5000/api/products/stats/overview \
  -H "Authorization: Bearer <token>"
```

---

## 📌 Notas Importantes

1. **Categorías Válidas**: "Suplementos", "Ropa", "Accesorios", "Equipamiento", "Nutrición", "Otro"
2. **Gestión de Stock**: El stock solo se modifica mediante el módulo de movimientos (entradas/salidas)
3. **Soft Delete**: Los productos eliminados no se borran de la base de datos, solo se marcan como `isActive: false`
4. **Nombres Únicos**: No puede haber dos productos con el mismo nombre
5. **Precios**: Se manejan en pesos colombianos sin decimales
