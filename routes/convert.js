import express from 'express';
import { conversionQueue } from '../queue.js';
import { requireAuth } from '../middleware/auth.js';
import File from '../models/File.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// push job
router.post('/', requireAuth, async (req,res)=>{
  const { url, format='mp3', public=true } = req.body;
  if(!url) return res.status(400).json({ error: 'missing url' });
  const job = await conversionQueue.add('convert', { url, format, public, userId: req.user.uid });
  return res.json({ jobId: job.id });
});

// list user's files
router.get('/files', requireAuth, async (req,res)=>{
  const files = await File.find({ owner: req.user.uid }).sort({ createdAt: -1 }).limit(100);
  return res.json({ files });
});

export default router;
