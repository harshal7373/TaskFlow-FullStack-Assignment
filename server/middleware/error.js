export function notFound(req,res) { res.status(404).json({message:'Endpoint not found'}); }
export function errorHandler(err,req,res,next) {
 if (err.name==='ValidationError') return res.status(400).json({message:Object.values(err.errors).map(e=>e.message).join('; ')});
 if (err.name==='CastError') return res.status(400).json({message:'Invalid resource ID'});
 if (err.code===11000) return res.status(409).json({message:'An account with this email already exists'});
 console.error(err);
 return res.status(500).json({message:'Unexpected server error'});
}
