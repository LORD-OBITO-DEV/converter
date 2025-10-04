import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function requireAuth(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({ error: 'no token' });
  const parts = h.split(' ');
  if(parts.length !== 2) return res.status(401).json({ error: 'bad token' });
  try{
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
    req.user = payload; return next();
  }catch(e){ return res.status(401).json({ error: 'invalid token' }); }
}

export function requireAdmin(req,res,next){
  if(!req.user) return res.status(401).json({ error: 'no user' });
  if(req.user.role !== 'admin') return res.status(403).json({ error: 'admin only' });
  return next();
}
