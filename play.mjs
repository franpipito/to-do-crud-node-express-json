import { readTasks, writeTasks } from "./db.mjs"


const main = async () => {
    const tasks = await readTasks()
    tasks.push({ id: Date.now().toString(), titulo: 'Probar', estado: 'pendiente'})
    await writeTasks(tasks)
    const again = await readTasks()
    console.log('Total tareas:', again.length)
}
main().catch(console.error)
