import {Router} from 'express';
import {register,login,me,users} from '../controllers/authController.js';
import {protect} from '../middleware/auth.js';
const r=Router();r.post('/register',register);r.post('/login',login);r.get('/me',protect,me);r.get('/users',protect,users);export default r;
