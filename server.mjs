import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors' //para render
import tasksRouter from './routes/tasks.routes.mjs'


const __filename = fileURLToPath(import.meta.url) //import.meta.url da la URL del modulo, fileURLToPath la convierte a ruta
const __dirname = path.dirname(__filename) //dirname para rutas absolutas seguras


//crear app y puerto
const app = express()
const PORT = process.env.PORT || 3000



// CORS: permitir netlify
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://TU-SITIO.netlify.app'      
]
app.use(cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type']
}))


//middlewares
app.use(express.json()) //transforma el body JSON en req.body antes de que llegue a las rutas
app.use(express.static(path.join(__dirname,'public'))) //permite servir index.html y style.css sin escribir rutas manuales

//logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next() //para que no se corte la cadena
})

//routes
//health confirma que el server corre y responde JSON
app.get('/health', (req,res)=> { 
    res.json({ ok:true, time: new Date().toISOString() })
}) 

//router de tareas
app.use('/api/tasks', tasksRouter)

//404
app.use((req,res)=> res.status(404).send('No encontrado')) //se ejecuta si ninguna ruta anterior respondio

//listen
app.listen(PORT, () => console.log(`http://localhost:${PORT}`)) //abre socket en puerto 3000 para aceptar conexiones, callback listen confirma que ya esta listo


