import { readTasks, writeTasks} from '../db.mjs'

//obtiene todas las tareas
export async function getAllTasks(req, res) {
    try{
        const tasks = await readTasks()
        res.json(tasks)
    } catch (err) {
        res.status(500).json({error: 'No se pudieron leer las tareas'})
    }
}

//crear tarea
export async function createTask(req, res) {
    try{
        //Si llega undefined el ||{} evita que rompa 
        const { titulo, descripcion, fecha_limite, estado } = req.body || {}

        //validacion minima
        // titulo obligatorio trim no acepta cadenas vacias
        if (!titulo || !titulo.trim()) {
            return res.status(400).json({ error: 'el campo "Titulo" es obligatorio'})
        }
        if (fecha_limite != null && fecha_limite !== '') {
            const okFormato = /^\d{4}-\d{2}-\d{2}$/.test(fecha_limite)
            const probe = new Date(fecha_limite + 'T00:00:00') // local
            if (!okFormato || Number.isNaN(probe.getTime())) {
                return res.status(400).json({ error: 'fecha_limite no es válida' })
            }
        }
        // validacion de estado
        const ESTADOS_VALIDOS = new Set(['pendiente', 'en_progreso', 'completada'])

        if (estado !== undefined) {
            const normalizado = typeof estado === 'string' ? estado.trim().toLowerCase() : estado
            if (!ESTADOS_VALIDOS.has(normalizado)) {
                return res.status(400).json({ error: 'estado no valido'})
            }
        }
        
        //objeto tarea
        const nueva = {
            //trim en strings para evitar espacios basura
            id: Date.now().toString(), // id simple
            titulo: titulo.trim(), // limpia espacios
            descripcion: descripcion?.trim() ?? '', // ? sirve para no romper si descripcion es undefined
            fecha_limite: fecha_limite || null, // queda 'YYYY-MM-DD' o null
            estado: estado || 'pendiente'        
        }
        //CRUD
        const tasks = await readTasks() //trae el array
        tasks.push(nueva) // agrega al final
        await writeTasks(tasks) // guarda en tasks.json
        return res.status(201).json(nueva) //si sale bien devuelve created con la tarea creada
    } catch (err) {
        console.error('createTask error: ', err)
        res.status(500).json({ error: 'No se pudo crear la tarea'})
    }
}

// Eliminar tarea
export async function deleteTask(req, res) {
    try{
        // lee id de la URL
        const { id } = req.params 
        
        //compara strings
        const idStr = String(id)

        //lee estado actual
        const tasks = await readTasks() //espera array

        //busca posicion de tarea por id
        const idx = tasks.findIndex(t => String(t.id) === idStr)

        // si no existe devuelve 404 y corta
        if (idx === -1) {
            return res.status(404).json({ error: 'tarea no encontrada'})
        }

        //elimina 1 elemento en esa posicion
        tasks.splice(idx, 1)

        //presiste el nuevo array
        await writeTasks(tasks)

        //Delete exitoso sin cuerpo
        return res.status(204).end()
    } catch(err) {
        // cualquier excepcion devuelve 500
        return res.status(500).json({ error: 'no se pudo eliminar'})
    }
}

// Editar tarea
export async function updateTask(req, res) {
    try{
        // Lee id y body
        const { id } = req.params
        const body = req.body || {} //si no llega body usa un objeto vacio

        
        // acepta solo campos conocidos
        const permitidos = new Set(['titulo', 'descripcion', 'fecha_limite', 'estado']) //estructura rapida para chequear pertenencia
        const presentes = Object.keys(body).filter(k => permitidos.has(k)) //guarda que claves manda el cliente y filter se queda con las que conoce


        // si no hay claves conocidas devuelve 400
        if (presentes.length === 0 ) {
            return res.status(400).json({ error: 'no hay campos para actualizar'})
        }

        //normalizar y validar para los campos conocidos
        const patch = {} //guarda modificaciones validas


        // titulo 
        if ('titulo' in body) { //el cliente envió aunque sea vacio
            const v = String(body.titulo ?? '').trim() //es string si o si
            //si titulo esta vacio no se acepta y devuelve 400
            if (!v) return res.status(400).json({ error: 'titulo no puede quedar vacio'})
            patch.titulo = v //si titulo es valido se guarda 
        }

        // Descripcion
        if ('descripcion' in body) {
            const v = body.descripcion
            patch.descripcion = (v == null) ? '' : String(v).trim()
        }

        //fecha_limite
        if ('fecha_limite' in body) {
            const v = body.fecha_limite
            //si llega null / '' queda solo null
            if (v == null || v === '') {
                patch.fecha_limite = null
            } else {
                const s = String(v).trim()
                const okFormato = /^\d{4}-\d{2}-\d{2}$/.test(s)
                const probe = new Date(s + 'T00:00:00')
                if (!okFormato || Number.isNaN(probe.getTime())) {
                    return res.status(400).json({ error: 'fecha_limite no es valida (AAAA-MM-DD)'})
                }
                patch.fecha_limite = s
            }
        }

        //estado
        if('estado' in body) {
            const estados = new Set(['pendiente', 'en_progreso', 'completada'])
            //normalizar a minuscula 
            const v = String(body.estado ?? '').trim().toLowerCase()
            // si no esta en el set devuelve 400
            if (!estados.has(v)) {
                return res.status(400).json({ error: 'estado no valido'})
            }
            //si es valido guarda en patch
            patch.estado = v
        }

        //carga tareas y busca
        const tasks = await readTasks() //obtiene el array desde tasks.json
        const idx = tasks.findIndex(t => String(t.id) === String(id)) //compara como string el id
        //si no existe id devuelve 404
        if (idx === -1) {
            return res.status(404).json({ error: 'tarea no encontrada'})
        }

        //nuevo objeto que copia la tarea vieja y le pone los campos de patch
        const updated = {...tasks[idx], ...patch}
        tasks[idx] = updated
        
        //guarda y responde
        await writeTasks(tasks) //persiste el array
        return res.json(updated) //responde 200 devolviendo tarea nueva
    //excepcion no controlada devuelve 500
    } catch (err) {
        return res.status(500).json({ error: 'no se pudo actualizar'})
    }
}