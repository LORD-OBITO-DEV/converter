import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendWelcome } from '../utils/mailer.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

function signAccess(user){
  return jwt.sign({ uid: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN||'1h' });
}

router.post('/signup', async (req,res)=>{
  try{
    const { name, email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: 'missing' });
    const exists = await User.findOne({ email });
    if(exists) return res.status(409).json({ error: 'exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, passwordHash: hash });
    await user.save();
    try{ await sendWelcome(email, name); }catch(e){ console.error('mail err', e); }
    const token = signAccess(user);
    return res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  }catch(e){ console.error(e); return res.status(500).json({ error: 'server' }); }
});

router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: 'missing' });
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ error: 'invalid' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({ error: 'invalid' });
    const token = signAccess(user);
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  }catch(e){ console.error(e); return res.status(500).json({ error: 'server' }); }
});

export default router;
