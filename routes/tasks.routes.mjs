import { Router } from 'express'
import { getAllTasks, createTask, deleteTask, updateTask} from '../controllers/tasks.controller.mjs' //logica en el controller

//crea objeto Router 
const router = Router()

//objeto router recibe get/post/put/delete
router.get('/', getAllTasks) // GET /api/tasks
router.post('/', createTask) // POST /api/tasks
router.delete('/:id', deleteTask) // DELETE /api/tasks/:id
router.put('/:id', updateTask) // PUT /api/tasks/:id

export default router