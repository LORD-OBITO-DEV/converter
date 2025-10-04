import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import convertRoutes from './routes/convert.js';
import ticketRoutes from './routes/tickets.js';
import path from 'path';

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15*60*1000, max: 200 }));

// connect mongo
mongoose.connect(process.env.MONGO_URI, { autoIndex: true }).then(()=>console.log('Mongo connected'))
  .catch(e=>{ console.error('Mongo err', e); process.exit(1); });

// static files
app.use('/files', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Server listening', PORT));
