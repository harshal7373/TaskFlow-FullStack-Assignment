import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const schema = new mongoose.Schema({
 name: { type: String, trim: true, required: true, maxlength: 80 },
 email: { type: String, trim: true, lowercase: true, unique: true, required: true,
   match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'] },
 password: { type: String, required: true, select: false },
 role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, {timestamps:true});
schema.pre('save', async function(next) {
 try { if(this.isModified('password')) this.password = await bcrypt.hash(this.password, 12); next(); }
 catch(err){ next(err); }
});
schema.methods.comparePassword = function(password) { return bcrypt.compare(password, this.password); };
export default mongoose.model('User', schema);
