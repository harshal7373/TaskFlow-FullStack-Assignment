import 'dotenv/config';
import mongoose from 'mongoose';
import {connectDB} from '../config/db.js';
import User from '../models/User.js';
await connectDB();
for(const {email,password,role,name} of [
 {email:process.env.SEED_USER_EMAIL,password:process.env.SEED_USER_PASSWORD,role:'user',name:'Test User'},
 {email:process.env.SEED_ADMIN_EMAIL,password:process.env.SEED_ADMIN_PASSWORD,role:'admin',name:'Test Admin'}]){
 if(!email||!password)continue;
 if(password.length<8)throw new Error('Seed passwords must be at least 8 characters');
 const current=await User.findOne({email});
 if(current){current.name=name;current.role=role;current.password=password;await current.save();}
 else await User.create({email,password,role,name});
 console.log(`Seeded ${email} (${role})`);
}
await mongoose.disconnect();
