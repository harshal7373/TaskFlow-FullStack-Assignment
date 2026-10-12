import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function protect(req,res,next) {
 try {
  const match = /^Bearer (.+)$/i.exec(req.headers.authorization||'');
  if (!match) return res.status(401).json({message:'Authentication required'});
  const data = jwt.verify(match[1],process.env.JWT_SECRET,{algorithms:['HS256']});
  const user = await User.findById(data.id).select('name email role');
  if (!user) return res.status(401).json({message:'Account no longer exists'});
  req.user=user; next();
 } catch(e){ return res.status(401).json({message:'Invalid or expired token'}); }
}
