import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
dotenv.config();

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;
  if(!email || !pass) { console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD'); process.exit(1); }
  let u = await User.findOne({ email });
  if(u){ console.log('Admin already exists'); process.exit(0); }
  const hash = await bcrypt.hash(pass, 10);
  u = new User({ name: 'Admin', email, passwordHash: hash, role: 'admin', verified: true });
  await u.save();
  console.log('Admin created:', email);
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
