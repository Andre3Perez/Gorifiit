# 📋 API Quick Reference - GORIFIT

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication Header
```
Authorization: Bearer <token>
```

---

## 🔐 AUTH ENDPOINTS

| Endpoint | Method | Auth | Body |
|----------|--------|------|------|
| `/auth/register` | POST | ❌ | `username, email, password, role?` |
| `/auth/login` | POST | ❌ | `email, password` |
| `/auth/me` | GET | ✅ | - |

---

## 📦 PRODUCT ENDPOINTS

| Endpoint | Method | Auth | Query/Body | Description |
|----------|--------|------|------------|-------------|
| `/products` | GET | ✅ | `?categoria=X&stockBajo=true` | List products |
| `/products/:id` | GET | ✅ | - | Get product |
| `/products` | POST | ✅ | `nombre, categoria, precio, stock?, stockMinimo?, descripcion?` | Create product |
| `/products/:id` | PUT | ✅ | `nombre?, precio?, categoria?, stockMinimo?, descripcion?` | Update product |
| `/products/:id` | DELETE | ✅ Admin | - | Delete product |
| `/products/stats/overview` | GET | ✅ | - | Get stats |

---

## 🔄 MOVEMENT ENDPOINTS

| Endpoint | Method | Auth | Query/Body | Description |
|----------|--------|------|------------|-------------|
| `/movements` | GET | ✅ | `?tipo=X&producto=Y&limit=100` | List movements |
| `/movements/:id` | GET | ✅ | - | Get movement |
| `/movements/entrada` | POST | ✅ | `producto, cantidad, motivo, observaciones?` | Register entry |
| `/movements/salida` | POST | ✅ | `producto, cantidad, motivo, observaciones?` | Register exit |
| `/movements/producto/:id` | GET | ✅ | - | Product history |
| `/movements/stats/overview` | GET | ✅ | - | Get stats |

---

## 📝 PRODUCT CATEGORIES
- `Suplementos`
- `Ropa`
- `Accesorios`
- `Equipamiento`
- `Nutrición`
- `Otro`

---

## 👥 USER ROLES
- `user` - Standard user
- `admin` - Administrator (can delete products)

---

## 🔢 HTTP STATUS CODES

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 💰 VALUE CALCULATIONS

### Movement Value
```javascript
// Entry: positive
value = quantity × product.price

// Exit: negative  
value = -(quantity × product.price)
```

### Stock Value
```javascript
stockValue = newStock × product.price
```

**Example:**
- Entry: 10 units @ $75,000 = **+$750,000**
- Exit: 10 units @ $75,000 = **-$750,000**
- Stock: 50 units @ $75,000 = **$3,750,000**

---

## 🚀 QUICK START

### 1. Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user","email":"user@test.com","password":"123456"}'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'
```

### 3. Save Token
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Creatina","categoria":"Suplementos","precio":75000}'
```

### 5. Register Entry
```bash
curl -X POST http://localhost:5000/api/movements/entrada \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"producto":"PRODUCT_ID","cantidad":50,"motivo":"Compra"}'
```

### 6. Register Exit
```bash
curl -X POST http://localhost:5000/api/movements/salida \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"producto":"PRODUCT_ID","cantidad":10,"motivo":"Venta"}'
```

---

## 📊 COMMON QUERIES

### Products with low stock
```bash
GET /products?stockBajo=true
```

### Filter by category
```bash
GET /products?categoria=Suplementos
```

### Only entries
```bash
GET /movements?tipo=entrada
```

### Only exits
```bash
GET /movements?tipo=salida
```

### Product history
```bash
GET /movements/producto/PRODUCT_ID
```

---

## 🎯 RESPONSE FORMAT

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## ⚠️ COMMON ERRORS

### 401 Unauthorized
```
Missing or invalid token
Solution: Include "Authorization: Bearer <token>"
```

### 400 Bad Request
```
Invalid or missing required fields
Solution: Check body params
```

### 404 Not Found
```
Resource doesn't exist
Solution: Verify ID
```

### Stock insufficient (400)
```
Can't register exit - not enough stock
Solution: Check available stock first
```

---

## 💡 TIPS

✅ Always save token after login  
✅ Use environment variables for token  
✅ Include detailed observations in movements  
✅ Set appropriate stockMinimo values  
✅ Regularly check low stock products  
✅ Use filters to reduce response size  
✅ Validate data before sending  

---

## 📱 POSTMAN IMPORT

Import: `POSTMAN_COLLECTION.json`

Variables to set:
- `baseUrl` = `http://localhost:5000/api`
- `token` = Auto-set after login

---

**For complete documentation, see:**
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [AUTH.md](./AUTH.md)
- [PRODUCTS.md](./PRODUCTS.md)
- [MOVEMENTS.md](./MOVEMENTS.md)
- [EXAMPLES.md](./EXAMPLES.md)
