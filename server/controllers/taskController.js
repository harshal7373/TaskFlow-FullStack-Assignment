import mongoose from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';
const permitted=['title','description','priority','dueDate','status','assignedUser'];
const isValidId=id=>mongoose.isValidObjectId(id);
const scope=user=>user.role==='admin'?{}:{$or:[{createdBy:user._id},{assignedUser:user._id}]};
const allowed=task=>({title:task.title,description:task.description,priority:task.priority,dueDate:task.dueDate,status:task.status,assignedUser:task.assignedUser});
function payload(req){const out={};for(const key of permitted)if(Object.hasOwn(req.body,key))out[key]=req.body[key];return out;}
async function validateAssignment(assignedUser){return isValidId(assignedUser)&&!!(await User.exists({_id:assignedUser}));}
export async function listTasks(req,res,next){
 try{
  const {search='',status='',priority='',sort='newest',page='1',limit='8'}=req.query;
  if(!['','Pending','In Progress','Completed'].includes(status)||!['','Low','Medium','High'].includes(priority)||!['newest','oldest','dueAsc','dueDesc'].includes(sort))return res.status(400).json({message:'Invalid filter'});
  const pg=Number(page),lim=Number(limit);
  if(!Number.isInteger(pg)||pg<1||!Number.isInteger(lim)||lim<1||lim>100||typeof search!=='string'||search.length>100)return res.status(400).json({message:'Invalid pagination or search'});
  const filter={$and:[scope(req.user)]};
  if(search) filter.$and.push({title:{$regex:search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'}});
  if(status)filter.$and.push({status});if(priority)filter.$and.push({priority});
  const order={newest:{createdAt:-1},oldest:{createdAt:1},dueAsc:{dueDate:1},dueDesc:{dueDate:-1}}[sort];
  const [tasks,total,summary]=await Promise.all([
   Task.find(filter).sort(order).skip((pg-1)*lim).limit(lim).populate('assignedUser','name email'),
   Task.countDocuments(filter),Task.aggregate([{$match:scope(req.user)},{$group:{_id:'$status',count:{$sum:1}}}])
  ]);
  const metrics={total:0,pending:0,inProgress:0,completed:0};
  for(const item of summary){metrics.total+=item.count;if(item._id==='Pending')metrics.pending=item.count;if(item._id==='In Progress')metrics.inProgress=item.count;if(item._id==='Completed')metrics.completed=item.count;}
  res.json({tasks,total,page:pg,pages:Math.ceil(total/lim),metrics});
 }catch(err){next(err);}
}
export async function getTask(req,res,next){
 try{if(!isValidId(req.params.id))return res.status(400).json({message:'Invalid task ID'});
  const task=await Task.findOne({_id:req.params.id,...scope(req.user)}).populate('assignedUser','name email');
  if(!task)return res.status(404).json({message:'Task not found'});res.json(task);
 }catch(err){next(err);}
}
export async function createTask(req,res,next){
 try{const data=payload(req);
  if(!data.title||!data.dueDate||!data.assignedUser)return res.status(400).json({message:'Title, due date and assigned user are required'});
  if(!await validateAssignment(data.assignedUser))return res.status(400).json({message:'Assigned user does not exist'});
  const task=await Task.create({...data,createdBy:req.user._id});
  await task.populate('assignedUser','name email');res.status(201).json(task);
 }catch(err){next(err);}
}
export async function updateTask(req,res,next){
 try{if(!isValidId(req.params.id))return res.status(400).json({message:'Invalid task ID'});
  const task=await Task.findOne({_id:req.params.id,...scope(req.user)});
  if(!task)return res.status(404).json({message:'Task not found'});
  const data=payload(req);
  if(Object.hasOwn(data,'assignedUser')&&!await validateAssignment(data.assignedUser))return res.status(400).json({message:'Assigned user does not exist'});
  Object.assign(task,data);await task.save();await task.populate('assignedUser','name email');res.json(task);
 }catch(err){next(err);}
}
export async function deleteTask(req,res,next){
 try{if(!isValidId(req.params.id))return res.status(400).json({message:'Invalid task ID'});
  const task=await Task.findOneAndDelete({_id:req.params.id,...scope(req.user)});
  if(!task)return res.status(404).json({message:'Task not found'});res.json({message:'Task deleted'});
 }catch(err){next(err);}
}
