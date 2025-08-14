# Tareas CRUD (Node + Express + JSON)

Mini proyecto para practicar un **backend con Node.js + Express** y un **frontend estático**.  
Persistencia simple en `tasks.json` usando `fs/promises` (sin base de datos). Código en **ES Modules** (`.mjs`).

## Requisitos
- Node 18+  
- npm

## Cómo correr
```bash
npm install
npm run dev       # Servidor: http://localhost:3000
npm run play      # Prueba de persistencia: agrega una tarea a tasks.json
npm run test-esm  # Test rápido de import/export (math/index)
```
---
### Estructura
public/        # HTML/CSS/JS del frontend
server.mjs     # Servidor Express (ESM)
db.mjs         # readTasks/writeTasks sobre tasks.json (fs/promises)
play.mjs       # Script de prueba de la "BD" JSON
tasks.json     # "Base de datos" en JSON
index.mjs      # Demo de import/export con math.mjs
math.mjs       # Función sumar para test ESM

---

