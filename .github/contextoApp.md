Actúa como un desarrollador senior fullstack. Necesito que construyas un sistema completo de gestión de inventario para un negocio llamado GORIFIT.

### 🧩 Tecnologías obligatorias:

* Frontend: Next + TailwindCSS
* Backend: Node.js + Express
* Autenticación con JWT
* Base de datos: MongoDB (usando Mongoose)
* Usa los agentes instalados para el frontend y para el backend

---

## 🎯 Objetivo del sistema:

Permitir llevar un control de inventario en tiempo real, registrando productos, entradas y salidas, evitando errores y mostrando información precisa en todo momento.

---

## 📦 Funcionalidades requeridas:

### 1. Gestión de productos

* Crear, editar, eliminar productos
* Campos:

  * nombre
  * categoría
  * precio
  * stock

---

### 2. Movimientos de inventario

* Registrar entradas (aumenta stock)
* Registrar salidas (disminuye stock)
* Cada movimiento debe tener:

  * tipo (entrada / salida)
  * producto
  * cantidad
  * fecha

---

### 3. Lógica clave

* El stock se calcula automáticamente
* No permitir stock negativo
* Validar antes de registrar salidas

---

### 4. Visualización

* Lista de productos con stock actualizado
* Historial de movimientos
* Indicador de stock bajo (por ejemplo < 5 unidades)

---

## 🧠 Backend (Node + Express)

* Crear estructura MVC

* Modelos con Mongoose:

  * Product
  * Movement

* Rutas:

  * /api/products
  * /api/movements

* Controladores:

  * CRUD productos
  * Registrar entradas/salidas

* Conexión a MongoDB usando variables de entorno

---

## 🎨 Frontend (Next + Tailwind)

### Vistas:

* Login
* Dashboard
* Inventario (tabla de productos)
* Formulario para crear/editar producto
* Registro de movimientos
* Historial

### Requisitos:

* Usar hooks (useState, useEffect)
* Consumir API con fetch
* Diseño limpio con Tailwind
* Mostrar alertas de errores con la libreria Sooner: https://sonner.emilkowal.ski/
* Uso de estilo neumorphismo en toda la aplicacion

---

## 📁 Estructura del proyecto:

/backend
/models
/routes
/controllers
server.js

/frontend
/src
/components
/pages
/services

---

## ⚙️ Extras importantes:

* Manejo de errores
* Código limpio y modular
* Comentarios en partes clave
* Instrucciones para correr el proyecto (README)

---

## 🚀 Entregable esperado:

* Código completo backend + frontend
* Instrucciones paso a paso para ejecutar
* Ejemplo de endpoints funcionando
* UI funcional conectada al backend

---

Genera todo el código listo para ejecutarse, organizado por carpetas, explicando brevemente cada parte importante.
