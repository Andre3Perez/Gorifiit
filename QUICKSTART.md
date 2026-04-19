# GORIFIT - Guía Rápida de Inicio

## 🚀 Inicio Rápido

### Instalación (Solo primera vez)

```powershell
# 1. Instalar dependencias del backend
cd backend
npm install

# 2. Instalar dependencias del frontend (abrir otra terminal)
cd frontend
npm install
```

### Ejecutar la Aplicación

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📝 Primer Uso

1. **Crear usuario admin** usando Postman/Thunder Client:
   ```
   POST http://localhost:5000/api/auth/register
   
   Body:
   {
     "username": "admin",
     "email": "admin@gorifit.com",
     "password": "123456",
     "role": "admin"
   }
   ```

2. **Iniciar sesión en la app**:
   - Ir a: http://localhost:3000
   - Email: admin@gorifit.com
   - Password: 123456

## 📦 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🎯 Funcionalidades

1. **Dashboard** - Ver estadísticas generales
2. **Inventario** - Gestionar productos (crear, editar, eliminar)
3. **Movimientos** - Registrar entradas y salidas de stock
4. **Historial** - Ver todos los movimientos con filtros

## 🐛 Solución de Problemas

### Puerto en uso
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Matar proceso
taskkill /PID <PID> /F
```

### Reinstalar dependencias
```powershell
# Backend
cd backend
Remove-Item node_modules -Recurse -Force
npm install

# Frontend
cd frontend
Remove-Item node_modules -Recurse -Force
npm install
```

---

**Para más información, ver [README.md](README.md)**
