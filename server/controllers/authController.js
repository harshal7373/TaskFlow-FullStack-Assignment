import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const sign=user=>jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d',algorithm:'HS256'});
const publicUser=user=>({_id:user._id,name:user.name,email:user.email,role:user.role});
export async function register(req,res,next){
 try{
  const {name,email,password}=req.body;
  if(typeof name!=='string'||!name.trim()||typeof email!=='string'||!/^\S+@\S+\.\S+$/.test(email)||typeof password!=='string'||password.length<8||!/[A-Z]/.test(password)||!/[a-z]/.test(password)||!/[0-9]/.test(password)||!/[!@#$%^&*()_+\-=]/.test(password))
   return res.status(400).json({message:'Provide name, valid email and password (8+ characters, upper/lowercase, number, special character)'});
  if(await User.exists({email:email.toLowerCase().trim()}))return res.status(409).json({message:'Email already registered'});
  const user=await User.create({name:name.trim(),email:email.toLowerCase().trim(),password});
  res.status(201).json({token:sign(user),user:publicUser(user)});
 }catch(err){next(err);}
}
export async function login(req,res,next){
 try{
  const {email,password}=req.body;
  if(typeof email!=='string'||typeof password!=='string')return res.status(400).json({message:'Email and password are required'});
  const user=await User.findOne({email:email.trim().toLowerCase()}).select('+password');
  if(!user||!(await user.comparePassword(password))) return res.status(401).json({message:'Incorrect email or password'});
  res.json({token:sign(user),user:publicUser(user)});
 }catch(err){next(err);}
}
export async function me(req,res){res.json({user:publicUser(req.user)});}
export async function users(req,res,next){try{res.json(await User.find().select('name email role').sort({name:1}));}catch(err){next(err);}}
