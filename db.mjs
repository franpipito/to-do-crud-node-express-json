import {readFile, writeFile } from 'node:fs/promises' //para usar promesas
import path from 'node:path'
import { fileURLToPath } from 'node:url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename) 
export const DB_PATH = path.join(__dirname, 'tasks.json')

export async function readTasks(){
    try{
        const raw = await readFile(DB_PATH,'utf8') //lee como texto
        if (!raw.trim()) //maneja archivos vacios
            return []

        try{
            return JSON.parse(raw)
        } catch (parseErr) {
            console.error('Json invalido en ', DB_PATH, parseErr.message)
            await writeFile(DB_PATH, '[]', 'utf8')
            return []
        }
    } catch (err) {
        if (err.code === 'ENOENT') { //archivo no existe evita que app explote
            await writeFile(DB_PATH, '[]','utf8') //lo creas inicializado
            return []
        }
        throw err //otros errores: propagalos
    }
}

export async function writeTasks(tasks){
    await writeFile(DB_PATH, JSON.stringify(tasks, null, 2), 'utf8')
}