# 🚀 Ejemplos de Uso - API GORIFIT

Esta guía proporciona ejemplos prácticos paso a paso de cómo usar la API.

---

## 📋 Tabla de Contenidos

1. [Flujo Completo de Registro y Login](#1-flujo-completo-de-registro-y-login)
2. [Gestión de Productos](#2-gestión-de-productos)
3. [Registro de Movimientos](#3-registro-de-movimientos)
4. [Consultas y Reportes](#4-consultas-y-reportes)

---

## 1. Flujo Completo de Registro y Login

### Paso 1: Registrar un nuevo usuario

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_gorifit",
    "email": "admin@gorifit.com",
    "password": "Secure123!",
    "role": "admin"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "65abc123def456789",
    "username": "admin_gorifit",
    "email": "admin@gorifit.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWJjMTIzZGVmNDU2Nzg5IiwiaWF0IjoxNzA1NjgwMDAwLCJleHAiOjE3MDYyODQ4MDB9.example_signature"
  }
}
```

### Paso 2: Guardar el token

```bash
# En tu terminal, guarda el token en una variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Paso 3: Verificar tu perfil

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 2. Gestión de Productos

### Paso 1: Crear varios productos

```bash
# Producto 1: Creatina
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Creatina Monohidrato 500g",
    "categoria": "Suplementos",
    "precio": 75000,
    "stock": 0,
    "stockMinimo": 10,
    "descripcion": "Creatina pura micronizada de alta calidad"
  }'

# Producto 2: Proteína
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Proteína Whey 2kg",
    "categoria": "Suplementos",
    "precio": 150000,
    "stock": 0,
    "stockMinimo": 5,
    "descripcion": "Proteína de suero sabor chocolate"
  }'

# Producto 3: Camiseta
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Camiseta Dry-Fit",
    "categoria": "Ropa",
    "precio": 45000,
    "stock": 0,
    "stockMinimo": 20,
    "descripcion": "Camiseta deportiva tecnología Dry-Fit"
  }'
```

### Paso 2: Listar productos creados

```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN"
```

**Guardar ID de un producto para siguientes ejemplos:**
```bash
PRODUCTO_ID="65product123456789"
```

### Paso 3: Actualizar precio de un producto

```bash
curl -X PUT http://localhost:5000/api/products/$PRODUCTO_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 80000,
    "descripcion": "Creatina pura micronizada - Ahora con mejor precio"
  }'
```

### Paso 4: Ver estadísticas de productos

```bash
curl -X GET http://localhost:5000/api/products/stats/overview \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Registro de Movimientos

### Ejemplo Completo: Flujo de Compra y Venta

#### Paso 1: Registrar entrada de mercancía (Compra al proveedor)

```bash
curl -X POST http://localhost:5000/api/movements/entrada \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "'"$PRODUCTO_ID"'",
    "cantidad": 100,
    "motivo": "Compra a proveedor nacional",
    "observaciones": "Factura #12345 - Proveedor XYZ S.A.S - Pago a 30 días"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Entrada registrada exitosamente",
  "data": {
    "_id": "65mov123456789",
    "tipo": "entrada",
    "producto": {
      "_id": "65product123456789",
      "nombre": "Creatina Monohidrato 500g",
      "categoria": "Suplementos"
    },
    "cantidad": 100,
    "stockAnterior": 0,
    "stockNuevo": 100,
    "motivo": "Compra a proveedor nacional",
    "observaciones": "Factura #12345..."
  }
}
```

#### Paso 2: Registrar primera venta (Salida)

```bash
curl -X POST http://localhost:5000/api/movements/salida \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "'"$PRODUCTO_ID"'",
    "cantidad": 10,
    "motivo": "Venta a cliente",
    "observaciones": "Cliente: Juan Pérez - Factura #001 - Efectivo"
  }'
```

#### Paso 3: Registrar segunda venta

```bash
curl -X POST http://localhost:5000/api/movements/salida \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "'"$PRODUCTO_ID"'",
    "cantidad": 15,
    "motivo": "Venta a cliente",
    "observaciones": "Cliente: María López - Factura #002 - Tarjeta"
  }'
```

#### Paso 4: Registrar una devolución (Entrada)

```bash
curl -X POST http://localhost:5000/api/movements/entrada \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "'"$PRODUCTO_ID"'",
    "cantidad": 2,
    "motivo": "Devolución de cliente",
    "observaciones": "Cliente: Juan Pérez - Producto sin abrir - Nota crédito #001"
  }'
```

### Ejemplo de Error: Intentar sacar más stock del disponible

```bash
curl -X POST http://localhost:5000/api/movements/salida \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "'"$PRODUCTO_ID"'",
    "cantidad": 500,
    "motivo": "Venta mayorista",
    "observaciones": "Intento de venta grande"
  }'
```

**Respuesta de Error:**
```json
{
  "success": false,
  "message": "Stock insuficiente. Stock actual: 77, cantidad solicitada: 500"
}
```

---

## 4. Consultas y Reportes

### 4.1 Consultar Historial Completo

```bash
curl -X GET http://localhost:5000/api/movements \
  -H "Authorization: Bearer $TOKEN"
```

### 4.2 Filtrar solo Entradas

```bash
curl -X GET "http://localhost:5000/api/movements?tipo=entrada" \
  -H "Authorization: Bearer $TOKEN"
```

### 4.3 Filtrar solo Salidas

```bash
curl -X GET "http://localhost:5000/api/movements?tipo=salida" \
  -H "Authorization: Bearer $TOKEN"
```

### 4.4 Historial de un Producto Específico

```bash
curl -X GET http://localhost:5000/api/movements/producto/$PRODUCTO_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 4.5 Productos con Stock Bajo

```bash
curl -X GET "http://localhost:5000/api/products?stockBajo=true" \
  -H "Authorization: Bearer $TOKEN"
```

### 4.6 Productos por Categoría

```bash
curl -X GET "http://localhost:5000/api/products?categoria=Suplementos" \
  -H "Authorization: Bearer $TOKEN"
```

### 4.7 Estadísticas Generales de Movimientos

```bash
curl -X GET http://localhost:5000/api/movements/stats/overview \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔥 Casos de Uso Avanzados

### Caso 1: Ajuste de Inventario

Cuando necesitas corregir el stock (por ejemplo, después de un conteo físico):

```bash
# Si encontraste que hay más unidades de las registradas
curl -X POST http://localhost:5000/api/movements/entrada \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "'"$PRODUCTO_ID"'",
    "cantidad": 5,
    "motivo": "Ajuste de inventario",
    "observaciones": "Conteo físico del 23/01/2024 - Se encontraron 5 unidades adicionales no registradas"
  }'

# Si encontraste menos unidades (merma, robo, etc.)
curl -X POST http://localhost:5000/api/movements/salida \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "'"$PRODUCTO_ID"'",
    "cantidad": 3,
    "motivo": "Ajuste de inventario",
    "observaciones": "Merma detectada en revisión mensual - Productos vencidos"
  }'
```

### Caso 2: Muestras Gratis

```bash
curl -X POST http://localhost:5000/api/movements/salida \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "'"$PRODUCTO_ID"'",
    "cantidad": 2,
    "motivo": "Muestra gratis",
    "observaciones": "Promoción de lanzamiento - Cliente nuevo: Carlos Rodríguez"
  }'
```

### Caso 3: Donación

```bash
curl -X POST http://localhost:5000/api/movements/salida \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "'"$PRODUCTO_ID"'",
    "cantidad": 10,
    "motivo": "Donación",
    "observaciones": "Donación a gimnasio comunitario Barrio Norte - Recibo #DON-001"
  }'
```

---

## 📊 Cálculo de Valores Monetarios

### Ejemplo con JavaScript/Node.js

```javascript
// Después de obtener los movimientos
const movements = [
  {
    tipo: "entrada",
    cantidad: 10,
    producto: { precio: 75000 }
  },
  {
    tipo: "salida",
    cantidad: 5,
    producto: { precio: 75000 }
  }
];

// Calcular valor de cada movimiento
movements.forEach(movement => {
  const valorMovimiento = movement.cantidad * movement.producto.precio;
  const valorConSigno = movement.tipo === 'entrada' ? valorMovimiento : -valorMovimiento;
  
  console.log(`${movement.tipo}: ${valorConSigno.toLocaleString('es-CO', { 
    style: 'currency', 
    currency: 'COP' 
  })}`);
});

// Salida:
// entrada: $750.000
// salida: -$375.000
```

### Ejemplo con Python

```python
import requests

# Obtener movimientos
response = requests.get(
    'http://localhost:5000/api/movements',
    headers={'Authorization': f'Bearer {token}'}
)

movements = response.json()['data']

# Calcular valores
for movement in movements:
    cantidad = movement['cantidad']
    precio = movement['producto']['precio']
    valor = cantidad * precio
    
    if movement['tipo'] == 'salida':
        valor = -valor
    
    print(f"{movement['tipo']}: ${valor:,.0f}")
```

---

## 🔒 Manejo de Errores Comunes

### Error 401: No Autorizado

```bash
# Asegúrate de incluir el token
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN"  # ← No olvides esto
```

### Error 400: Datos Inválidos

```json
{
  "success": false,
  "message": "Por favor proporcione todos los campos requeridos"
}
```
**Solución:** Verifica que estés enviando todos los campos requeridos.

### Error 404: Recurso No Encontrado

```json
{
  "success": false,
  "message": "Producto no encontrado"
}
```
**Solución:** Verifica que el ID sea correcto y que el recurso exista.

---

## 💡 Tips y Buenas Prácticas

1. **Siempre guarda el token** después del login para usarlo en requests subsiguientes
2. **Usa variables de entorno** para almacenar el token en producción
3. **Valida los datos** antes de enviarlos al servidor
4. **Maneja los errores** apropiadamente en tu aplicación
5. **Registra observaciones detalladas** en los movimientos para mejor trazabilidad
6. **Haz conteos físicos regulares** y ajusta el inventario cuando sea necesario
