# 🔄 Módulo de Movimientos de Inventario

Base URL: `/api/movements`

**Nota:** Todos los endpoints requieren autenticación (Bearer Token)

---

## 📋 Listar Movimientos

Obtiene el historial de movimientos de inventario con filtros opcionales.

**Endpoint:** `GET /api/movements`  
**Acceso:** Privado  
**Autenticación:** Requerida

### Headers

```http
Authorization: Bearer <token>
```

### Query Parameters (Opcionales)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| tipo | String | Filtra por tipo: "entrada" o "salida" |
| producto | String | Filtra por ID de producto |
| limit | Number | Número máximo de resultados (default: 100) |

### Response Success (200)

```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "64xyz789abc123def",
      "tipo": "entrada",
      "producto": {
        "_id": "64abc123def456789",
        "nombre": "Creatina Monohidrato 500g",
        "categoria": "Suplementos",
        "precio": 75000
      },
      "cantidad": 20,
      "motivo": "Compra a proveedor",
      "observaciones": "Factura #12345",
      "usuario": {
        "_id": "64user123456789",
        "username": "juan_perez"
      },
      "stockAnterior": 45,
      "stockNuevo": 65,
      "createdAt": "2024-01-20T14:30:00.000Z",
      "updatedAt": "2024-01-20T14:30:00.000Z"
    }
  ]
}
```

### Ejemplos cURL

```bash
# Obtener todos los movimientos
curl -X GET http://localhost:5000/api/movements \
  -H "Authorization: Bearer <token>"

# Solo entradas
curl -X GET "http://localhost:5000/api/movements?tipo=entrada" \
  -H "Authorization: Bearer <token>"

# Movimientos de un producto específico
curl -X GET "http://localhost:5000/api/movements?producto=64abc123def456789" \
  -H "Authorization: Bearer <token>"

# Últimas 50 salidas
curl -X GET "http://localhost:5000/api/movements?tipo=salida&limit=50" \
  -H "Authorization: Bearer <token>"
```

---

## 🔍 Obtener Movimiento por ID

Obtiene los detalles completos de un movimiento específico.

**Endpoint:** `GET /api/movements/:id`  
**Acceso:** Privado  
**Autenticación:** Requerida

### Headers

```http
Authorization: Bearer <token>
```

### URL Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | String | ID del movimiento (MongoDB ObjectId) |

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "_id": "64xyz789abc123def",
    "tipo": "entrada",
    "producto": {
      "_id": "64abc123def456789",
      "nombre": "Creatina Monohidrato 500g",
      "categoria": "Suplementos",
      "precio": 75000,
      "stock": 65,
      "stockMinimo": 10,
      "descripcion": "Creatina pura micronizada"
    },
    "cantidad": 20,
    "motivo": "Compra a proveedor",
    "observaciones": "Factura #12345",
    "usuario": {
      "_id": "64user123456789",
      "username": "juan_perez",
      "email": "juan@gorifit.com"
    },
    "stockAnterior": 45,
    "stockNuevo": 65,
    "createdAt": "2024-01-20T14:30:00.000Z",
    "updatedAt": "2024-01-20T14:30:00.000Z"
  }
}
```

### Response Error (404)

```json
{
  "success": false,
  "message": "Movimiento no encontrado"
}
```

### Ejemplo cURL

```bash
curl -X GET http://localhost:5000/api/movements/64xyz789abc123def \
  -H "Authorization: Bearer <token>"
```

---

## 📥 Registrar Entrada

Registra una entrada de mercancía al inventario (incrementa el stock).

**Endpoint:** `POST /api/movements/entrada`  
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
  "producto": "64abc123def456789",
  "cantidad": 50,
  "motivo": "Compra a proveedor nacional",
  "observaciones": "Factura #12345 - Pago al contado"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| producto | String | Sí | ID del producto (MongoDB ObjectId) |
| cantidad | Number | Sí | Cantidad a agregar (debe ser > 0) |
| motivo | String | Sí | Razón de la entrada |
| observaciones | String | No | Notas adicionales |

### Response Success (201)

```json
{
  "success": true,
  "message": "Entrada registrada exitosamente",
  "data": {
    "_id": "64xyz789abc123def",
    "tipo": "entrada",
    "producto": {
      "_id": "64abc123def456789",
      "nombre": "Creatina Monohidrato 500g",
      "categoria": "Suplementos"
    },
    "cantidad": 50,
    "motivo": "Compra a proveedor nacional",
    "observaciones": "Factura #12345 - Pago al contado",
    "usuario": "64user123456789",
    "stockAnterior": 45,
    "stockNuevo": 95,
    "createdAt": "2024-01-20T14:30:00.000Z",
    "updatedAt": "2024-01-20T14:30:00.000Z"
  }
}
```

### Response Error (400)

```json
{
  "success": false,
  "message": "La cantidad debe ser un número válido mayor a 0"
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
curl -X POST http://localhost:5000/api/movements/entrada \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "64abc123def456789",
    "cantidad": 50,
    "motivo": "Compra proveedor",
    "observaciones": "Factura #12345"
  }'
```

---

## 📤 Registrar Salida

Registra una salida de mercancía del inventario (reduce el stock).

**Endpoint:** `POST /api/movements/salida`  
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
  "producto": "64abc123def456789",
  "cantidad": 10,
  "motivo": "Venta a cliente",
  "observaciones": "Cliente: Juan Pérez - Factura #456"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| producto | String | Sí | ID del producto (MongoDB ObjectId) |
| cantidad | Number | Sí | Cantidad a retirar (debe ser > 0) |
| motivo | String | Sí | Razón de la salida |
| observaciones | String | No | Notas adicionales |

### Response Success (201)

```json
{
  "success": true,
  "message": "Salida registrada exitosamente",
  "data": {
    "_id": "64xyz789abc123def",
    "tipo": "salida",
    "producto": {
      "_id": "64abc123def456789",
      "nombre": "Creatina Monohidrato 500g",
      "categoria": "Suplementos"
    },
    "cantidad": 10,
    "motivo": "Venta a cliente",
    "observaciones": "Cliente: Juan Pérez - Factura #456",
    "usuario": "64user123456789",
    "stockAnterior": 95,
    "stockNuevo": 85,
    "createdAt": "2024-01-20T16:45:00.000Z",
    "updatedAt": "2024-01-20T16:45:00.000Z"
  }
}
```

### Response Error (400) - Stock Insuficiente

```json
{
  "success": false,
  "message": "Stock insuficiente. Stock actual: 5, cantidad solicitada: 10"
}
```

### Ejemplo cURL

```bash
curl -X POST http://localhost:5000/api/movements/salida \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "64abc123def456789",
    "cantidad": 10,
    "motivo": "Venta a cliente",
    "observaciones": "Factura #456"
  }'
```

---

## 📜 Historial de un Producto

Obtiene todos los movimientos asociados a un producto específico.

**Endpoint:** `GET /api/movements/producto/:id`  
**Acceso:** Privado  
**Autenticación:** Requerida

### Headers

```http
Authorization: Bearer <token>
```

### URL Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | String | ID del producto |

### Response Success (200)

```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "64xyz789abc123def",
      "tipo": "entrada",
      "producto": "64abc123def456789",
      "cantidad": 50,
      "motivo": "Compra proveedor",
      "observaciones": "Factura #12345",
      "usuario": {
        "_id": "64user123456789",
        "username": "juan_perez"
      },
      "stockAnterior": 45,
      "stockNuevo": 95,
      "createdAt": "2024-01-20T14:30:00.000Z",
      "updatedAt": "2024-01-20T14:30:00.000Z"
    }
  ]
}
```

### Ejemplo cURL

```bash
curl -X GET http://localhost:5000/api/movements/producto/64abc123def456789 \
  -H "Authorization: Bearer <token>"
```

---

## 📊 Estadísticas de Movimientos

Obtiene estadísticas generales de los movimientos de inventario.

**Endpoint:** `GET /api/movements/stats/overview`  
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
    "totalMovimientos": 150,
    "totalEntradas": 85,
    "totalSalidas": 65,
    "cantidadEntrada": 2500,
    "cantidadSalida": 1800
  }
}
```

| Campo | Descripción |
|-------|-------------|
| totalMovimientos | Número total de movimientos registrados |
| totalEntradas | Número de entradas |
| totalSalidas | Número de salidas |
| cantidadEntrada | Suma total de unidades entradas |
| cantidadSalida | Suma total de unidades salidas |

### Ejemplo cURL

```bash
curl -X GET http://localhost:5000/api/movements/stats/overview \
  -H "Authorization: Bearer <token>"
```

---

## 💡 Cálculos de Valores

Para calcular valores monetarios de los movimientos:

### Valor del Movimiento
```javascript
// Para entradas: positivo
valorMovimiento = cantidad × producto.precio

// Para salidas: negativo
valorMovimiento = -(cantidad × producto.precio)
```

**Ejemplo:**
- Entrada de 10 unidades de creatina a $75,000 c/u = **+$750,000**
- Salida de 10 unidades de creatina a $75,000 c/u = **-$750,000**

### Valor en Stock
```javascript
valorStock = stockNuevo × producto.precio
```

**Ejemplo:**
- Si quedan 50 unidades en stock a $75,000 c/u = **$3,750,000**

---

## 📌 Notas Importantes

1. **Transacciones Atómicas**: 
   - Los movimientos utilizan MongoDB transactions
   - Si falla la actualización del stock, el movimiento no se registra
   - Garantiza consistencia de datos

2. **Validaciones**:
   - No se pueden registrar salidas si no hay stock suficiente
   - La cantidad debe ser siempre mayor a 0
   - El producto debe existir y estar activo

3. **Trazabilidad**:
   - Cada movimiento guarda el usuario que lo realizó
   - Se registra el stock anterior y nuevo para auditoría
   - Las fechas están en formato ISO 8601 (UTC)

4. **Motivos Comunes**:
   - **Entradas**: "Compra proveedor", "Devolución cliente", "Ajuste inventario", "Donación"
   - **Salidas**: "Venta cliente", "Muestra gratis", "Merma", "Ajuste inventario"

5. **Formato de Cantidad**:
   - Se acepta tanto Number como String
   - Se convierte automáticamente a número
   - Debe ser entero positivo
