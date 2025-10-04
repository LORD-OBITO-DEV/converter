import express from 'express';
import Ticket from '../models/Ticket.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, async (req,res)=>{
  const { subject, message } = req.body;
  if(!subject || !message) return res.status(400).json({ error: 'missing' });
  const t = new Ticket({ user: req.user.uid, subject, message });
  await t.save();
  return res.status(201).json({ ticket: t });
});

// admin can list all
router.get('/', requireAuth, requireAdmin, async (req,res)=>{
  const all = await Ticket.find().sort({ createdAt: -1 }).limit(200);
  return res.json({ tickets: all });
});

// reply / close
router.post('/:id/reply', requireAuth, async (req,res)=>{
  const { message } = req.body; const t = await Ticket.findById(req.params.id);
  if(!t) return res.status(404).json({ error: 'not found' });
  t.replies.push({ by: req.user.uid, message, at: new Date() });
  if(req.body.status) t.status = req.body.status;
  await t.save();
  return res.json({ ticket: t });
});

export default router;
