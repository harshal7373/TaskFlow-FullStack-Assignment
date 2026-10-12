import mongoose from 'mongoose';
const schema = new mongoose.Schema({
 title: {type:String,required:true,trim:true,maxlength:120},
 description: {type:String,trim:true,default:'',maxlength:2000},
 priority: {type:String,enum:['Low','Medium','High'],default:'Medium'},
 dueDate: {type:Date,required:true},
 status: {type:String,enum:['Pending','In Progress','Completed'],default:'Pending'},
 assignedUser: {type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
 createdBy: {type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
},{timestamps:true});
schema.index({createdBy:1,createdAt:-1});
schema.index({assignedUser:1,status:1});
export default mongoose.model('Task',schema);
