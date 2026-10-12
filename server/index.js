import 'dotenv/config';
import {app} from './app.js';
import {connectDB} from './config/db.js';
if (!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32)throw new Error('JWT_SECRET must be at least 32 characters');
await connectDB();app.listen(Number(process.env.PORT)||5000,()=>console.log('API server listening'));
