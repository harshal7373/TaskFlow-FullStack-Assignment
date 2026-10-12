import {Router} from 'express';
import {protect} from '../middleware/auth.js';
import {listTasks,getTask,createTask,updateTask,deleteTask} from '../controllers/taskController.js';
const r=Router();r.use(protect);r.route('/').get(listTasks).post(createTask);r.route('/:id').get(getTask).put(updateTask).delete(deleteTask);export default r;
