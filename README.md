# FranPipito To-Do (Node + Express + JSON)

![preview](docs/preview.png)

**Demo web:** https://tareasfrancopipito.netlify.app/  
**API (Render):** https://to-do-crud-node-express-json.onrender.com

Aplicación CRUD de tareas con backend en **Node.js + Express** persistiendo en **JSON** y frontend en **HTML+JS** sin frameworks. Incluye validaciones, estados de tarea y diseño responsive.

---

## ✨ Características
- Alta / edición / baja de tareas
- Estados: `pendiente`, `en_progreso`, `completada`
- Validaciones: título requerido, fecha `AAAA-MM-DD`, estado permitido
- Mensajes UX (guardando, creada/actualizada), bloqueo de botones y confirmación de borrado
- Tabla responsiva y badges de estado con colores
- Frontend desplegado en **Netlify** con **proxy /api** hacia Render (sin tocar JS)

## 🗂️ Endpoints principales
- `GET  /api/tasks`
- `POST /api/tasks`
- `PUT  /api/tasks/:id`
- `DELETE /api/tasks/:id`

## 🛠️ Tecnologías
- Node.js 22, Express
- Persistencia en `tasks.json`
- HTML, CSS, JS vanilla
- Netlify (frontend) + Render (API)

## ▶️ Correr en local
```bash
npm install
npm run dev
# abre http://localhost:3000
